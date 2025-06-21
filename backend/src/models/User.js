import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the user schema with fields and validations
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,  // full name is mandatory
    },

    email: {
        type: String,
        required: true,   // email is mandatory
        unique: true,     // email must be unique in the database
    },

    password: {
        type: String,
        required: true,   // password is mandatory
        minlength: 6      // minimum length of 6 characters
    },

    bio: {
        type: String,
        default: ""       // optional user bio, defaults to empty string
    },

    profilePic: {
        type: String,
        // default profile picture URL if none provided
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },

    nativeLanguage: {
        type: String,
        default: ""       // optional native language field
    },

    learningLanguage: {
        type: String,
        default: ""       // optional learning language field
    },

    location: {
        type: String,
        default: ""       // optional location field
    },

    isOnBoarded: {
        type: Boolean,
        default: false    // indicates if user completed onboarding process
    },

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"  // references other User documents (friends list)
        }
    ]
}, { timestamps: true }) // Automatically add createdAt and updatedAt fields

/// Pre-save hook to hash the password before saving the user document
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt with 10 rounds
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Continue saving the document
    } catch (error) {
        next(error); // Pass error to mongoose
    }
});

/// Instance method to compare entered password with hashed password in DB
userSchema.methods.comparePassword = async function (enteredPassword) {
    // bcrypt.compare returns true if passwords match, false otherwise
    const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
}

// Create the User model from the schema
const User = mongoose.model('User', userSchema)

// Export the User model to use in other parts of the app
export default User
