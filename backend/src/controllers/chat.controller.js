import { generateStreamToken } from "../lib/stream.js";

// 📌 Controller to generate a Stream Chat token for the authenticated user
export const getStreamToken = async (req, res) => {
    try {
        // 🔐 Generate a token using the user's ID (from protectRoute middleware)
        const token = generateStreamToken(req.user._id);

        // ✅ Respond with the generated token
        res
            .status(200)
            .json({
                success: true,
                message: "Stream token generated successfully",
                data: {
                    token
                }
            });
    } catch (error) {
        //  Log and return error if token generation fails
        console.log(`Error generating stream token: ${error.message}`);
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to generate stream token",
                error: error.message
            });
    }
}
// 📌 Controller to get the authenticated user's Stream Chat ID