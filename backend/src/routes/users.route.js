import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import {
    getRecommendedUsers,
    getMyFriends,
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    getOutgoingFriendRequests
} from '../controllers/users.controller.js';

export const router = express.Router();

// ✅ Apply protectRoute middleware to all routes in this router
// This ensures that only authenticated users can access any route defined below
router.use(protectRoute);

// 📍 GET /api/users/
// Get a list of recommended users to connect with (e.g., based on language or location)
router.get('/', getRecommendedUsers);

// 📍 GET /api/users/friends
// Retrieve the list of friends for the authenticated user
router.get('/friends', getMyFriends);

// 📍 POST /api/users/friend-request/:id
// Send a friend request to a user with the given ID
router.post('/friend-request/:id', sendFriendRequest);

// 📍 PUT /api/users/friend-request/:id/accept
// Accept a friend request from a user with the given ID
router.put('/friend-request/:id/accept', acceptFriendRequest);

// 📍 GET /api/users/friend-requests
// Get a list of incoming friend requests for the current user
router.get('/friend-requests', getFriendRequests);

// 📍 GET /api/users/outgoing-friend-requests
// Get a list of friend requests the current user has sent (pending)
router.get('/outgoing-friend-requests', getOutgoingFriendRequests); 
