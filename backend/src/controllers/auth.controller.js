import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Signup controller to register a new user
export const signup = async (req, res) => {
    const { email, password, fullName } = req.body

    try {
        // Validate required fields
        if (!email || !password || !fullName) {
            return res
                .status(400)
                .json({ message: 'All fields are required' })
        }

        // Validate password length
        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: 'Password must be at least 6 characters long' })
        }

        // Simple email format validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res
                .status(400)
                .json({ message: "Invalid email format" });
        }

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'User already exist' })
        }

        const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        // Create a new user document and save to DB
        // Password hashing should be handled in the User model's pre-save hook
        const newUser = await User.create({
            email,
            password,
            fullName,
            profilePic: randomAvatar,
        })


        try {
            const userData = {
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            }
            await upsertStreamUser(userData)
            console.log(`stream user created ${newUser.fullName}`)
        } catch (error) {
            console.log(`error in upsertStreamUser ${newUser.fullName}`, error)
        }

        // Generate a JWT token for the newly created user
        const token = jwt.sign({
            userId: newUser._id
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d' // token expires in 7 days
        })

        // Set JWT token in a cookie (httpOnly for security)
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // only send over HTTPS in production
        })

        // Send success response with user info (excluding sensitive fields ideally)
        res
            .status(201)
            .json({
                success: true,
                user: newUser
            })

    } catch (error) {
        // Log error and send generic server error response
        console.log(`error in signup controller`, error)
        res
            .status(500)
            .json({ message: 'Internal server error' })
    }
}

// Login controller to authenticate existing users
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate required fields
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'All fields are required' })
        }

        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            // If user not found, send invalid credentials response
            return res
                .status(400)
                .json({ message: 'Invalid credentials' })
        }

        // Verify password using a custom instance method on User model
        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json({ message: 'Invalid credentials' })
        }

        // Generate JWT token upon successful authentication
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        )

        // Set JWT token in httpOnly cookie
        res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        })

        // Send success response with user info
        res
            .status(200)
            .json({
                success: true,
                user,
            })
    } catch (error) {
        // Log error and send server error response
        console.log(`error in login controller`, error)
        res
            .status(500)
            .json({
                message: `internal server error`
            })
    }
}

// Logout controller to clear JWT cookie and log user out
export const logout = async (req, res) => {
    // Clear the 'jwt' cookie from the client
    res.clearCookie('jwt')

    // Send success response confirming logout
    res
        .status(200)
        .json({
            success: true,
            message: 'User logged out successfully'
        })
}


// Onboard controller to complete user profile setup
export const onboard = async (req, res) => {
    try {
        // Get user ID from the request object (set by protectRoute middleware after JWT verification)
        const userId = req.user._id;

        // Destructure the required onboarding fields from the request body
        const { fullName, bio, location, nativeLanguage, learningLanguage } = req.body;

        // Validate that all required fields are provided
        if (!fullName || !bio || !location || !nativeLanguage || !learningLanguage) {
            return res
                .status(400)
                .json({
                    message: 'All fields are required',
                    // Dynamically build a list of missing fields to help frontend validation
                    missingFields: [
                        !fullName ? 'fullName' : null,
                        !bio ? 'bio' : null,
                        !location ? 'location' : null,
                        !nativeLanguage ? 'nativeLanguage' : null,
                        !learningLanguage ? 'learningLanguage' : null
                    ].filter(Boolean) // remove null values
                });
        }

        // Update the user's profile in the database and mark them as onboarded
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,           // Update with submitted fields
                isOnBoarded: true      // Mark onboarding as completed
            },
            { new: true }              // Return the updated user object
        );

        // If user was not found (shouldn't happen unless user was deleted mid-session)
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update or create the user in the Stream service (e.g. for messaging or activity feed)
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),       // Stream user ID
                name: updatedUser.fullName,           // Display name
                image: updatedUser.profilePicture || null // Optional profile image
            });
            console.log(`Stream user updated for onboard: ${updatedUser.fullName}`);
        } catch (error) {
            // Log errors from Stream service but don't block onboarding
            console.log(`Error in upsertStreamUser during onboarding`, error);
        }

        // Respond with success and return the updated user info
        res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        // Catch and log unexpected errors
        console.log(`Error in onboard controller`, error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};
