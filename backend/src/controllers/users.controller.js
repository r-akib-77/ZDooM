import User from "../models/User.js";
import Friendreq from "../models/FriendReq.js";

// 📌 Get a list of recommended users (excluding self, current friends, and only onboarded users)
export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },// Exclude the current user
                { _id: { $nin: currentUser.friends } },// Exclude already added friends
                { isOnBoarded: true } // Only include users who completed onboarding
            ]
        }).select("-password -__v -createdAt -updatedAt"); // Remove sensitive and unnecessary fields

        res
            .status(200)
            .json({
                success: true,
                message: "Recommended users fetched successfully",
                data: recommendedUsers
            });
    } catch (error) {
        console.log(`Error fetching recommended users: ${error.message}`);
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to fetch recommended users",
                error: error.message
            });
    }
};

// 📌 Get the authenticated user's friends list
export const getMyFriends = async (req, res) => {
    try {
        const currentUser = await User
            .findById(req.user._id)
            .select('friends')
            .populate('friends', "fullName profilePicture nativeLanguage learningLanguage"); // Populate friends' basic info

        res.status(200).json({
            success: true,
            message: "Friends fetched successfully",
            data: currentUser.friends
        });
    } catch (error) {
        console.log(`Error fetching friends: ${error.message}`);
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to fetch friends",
                error: error.message
            });
    }
};

// 📌 Send a friend request to another user
export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: recipentId } = req.params;

        // 🚫 Prevent sending a request to oneself
        if (myId === recipentId) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "You cannot send a friend request to yourself"
                });
        }

        // ✅ Check if the recipient exists
        const recipient = await User.findById(recipentId);
        if (!recipient) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Recipient not found"
                });
        }

        // 🚫 Check if already friends
        if (recipient.friends.includes(myId)) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "You are already friends with this user"
                });
        }

        // 🚫 Check for existing friend request (in either direction)
        const existingRequest = await Friendreq.findOne({
            $or: [
                { sender: myId, recipient: recipentId },
                { sender: recipentId, recipient: myId }
            ]
        });

        if (existingRequest) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Friend request already sent"
                });
        }

        // ✅ Create a new friend request
        const friendRequest = await Friendreq.create({
            sender: myId,
            recipient: recipentId
        });

        res
            .status(201)
            .json({
                success: true,
                message: "Friend request sent successfully",
                data: friendRequest
            });

    } catch (error) {
        console.log(`Error sending friend request: ${error.message}`);
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to send friend request",
                error: error.message
            });
    }
};

// 📌 Accept a friend request by request ID
export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await Friendreq.findById(requestId);

        if (!friendRequest) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Friend request not found"
                });
        }

        // 🚫 Only the recipient can accept the request
        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({
                    success: false,
                    message: "You can only accept friend requests sent to you"
                });
        }

        // ✅ Update the request status to accepted
        friendRequest.status = "accepted";
        await friendRequest.save();

        // ✅ Add each user to the other's friends list
        await User
            .findByIdAndUpdate(friendRequest.sender, {
                $addToSet: { friends: friendRequest.recipient }
            });

        await User
            .findByIdAndUpdate(friendRequest.recipient, {
                $addToSet: { friends: friendRequest.sender }
            });

        res
            .status(200)
            .json({
                success: true,
                message: "Friend request accepted successfully"
            });

    } catch (error) {
        console.log(`Error accepting friend request: ${error.message}`);
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to accept friend request",
                error: error.message
            });
    }
};

// 📌 Get incoming friend requests and accepted ones sent by the user
export const getFriendRequests = async (req, res) => {
    try {
        // 📨 Get all pending requests sent *to* the user
        const incommingReq = await Friendreq
            .find({
                recipient: req.user._id,
                status: "pending"
            })
            .populate('sender', "fullName profilePicture nativeLanguage learningLanguage");

        // ✅ Get accepted requests that the user *sent*
        const acceptRequest = await Friendreq
            .find({
                sender: req.user._id,
                status: "accepted"
            })
            .populate('recipient', "fullName profilePicture");

        res
            .status(200)
            .json({
                success: true,
                message: "Friend requests fetched successfully",
                data: {
                    incommingReq,
                    acceptRequest
                }
            });

    } catch (error) {
        console.log(`Error fetching friend requests: ${error.message}`);
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to fetch friend requests",
                error: error.message
            });
    }
};

// 📌 Get all outgoing friend requests sent by the user
export const getOutgoingFriendRequests = async (req, res) => {
    try {
        const outgoingRequests = await Friendreq
            .find({
                sender: req.user._id,
                status: "pending"
            })
            .populate('recipient', "fullName profilePicture nativeLanguage learningLanguage");

        res
            .status(200)
            .json({
                success: true,
                message: "Outgoing friend requests fetched successfully",
                data: outgoingRequests
            });
    } catch (error) {
        console.log(`Error fetching outgoing friend requests: ${error.message}`);
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to fetch outgoing friend requests",
                error: error.message
            });
    }
};


// Note: The above code assumes that the User model has a 'friends' field which is an array of ObjectIds referencing other User documents.
// The Friendreq model is used to manage friend requests between users.
