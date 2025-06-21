import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';

export const router = express.Router();

// ✅ Apply authentication middleware to protect the route
// Only logged-in users can request a Stream Chat token
router.get('/token', protectRoute, getStreamToken); // 📍 GET /api/chat/token
// This route returns a Stream Chat token for the authenticated user
