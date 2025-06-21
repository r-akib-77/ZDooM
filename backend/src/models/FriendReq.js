import mongoose from "mongoose";

// 📌 Define the schema for a friend request
const friendRequestSchema = new mongoose.Schema(
    {
        // 🔹 User who sent the friend request
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",            // Reference to the User model
            required: true,
        },
        // 🔹 User who received the friend request
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",            // Reference to the User model
            required: true,
        },
        // 🔹 Status of the friend request (pending or accepted)
        status: {
            type: String,
            enum: ["pending", "accepted"], // Only allow these values
            default: "pending",            // Default to pending
        },
    },
    {
        // 🕒 Automatically include createdAt and updatedAt timestamps
        timestamps: true,
    }
);

// 📌 Create and export the model based on the schema
const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
