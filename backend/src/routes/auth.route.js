import express from "express";
// Import controller functions for authentication
import { login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

// Create a new Express router instance
export const router = express.Router();

// Route to handle user signup (registration)
// Calls the signup controller function when POST request is made to /signup
router.post('/signup', signup)

// Route to handle user login (authentication)
// Calls the login controller function when POST request is made to /login
router.post('/login', login)

// Route to handle user logout
// Calls the logout controller function when GET request is made to /logout
router.post('/logout', logout)


// Route to handle user onboarding
// - Middleware: protectRoute ensures the user is authenticated
// - Controller: onboard handles the onboarding form submission and updates user data
router.post('/onboard', protectRoute, onboard);

// Route to get the currently authenticated user's info
// - Middleware: protectRoute validates the JWT and attaches user data to req.user
// - Handler: sends back the authenticated user's data
router.get('/me', protectRoute, async (req, res) => {
    res
        .status(200)
        .json({
            success: true,
            user: req.user // User info is set by protectRoute middleware
        });
});
