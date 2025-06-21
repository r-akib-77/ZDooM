import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';

// 🔹 Load environment variables from .env file
dotenv.config();

// 🔐 Get Stream API credentials from environment variables
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_SECRET_KEY;

// ⚠️ Warn if credentials are missing
if (!api_key || !api_secret) {
    console.log(`Missing Stream API key or secret`);
}

// 🔗 Initialize the Stream Chat client using the API key and secret
const streamClient = StreamChat.getInstance(api_key, api_secret);

// 📌 Upsert (create or update) a Stream Chat user
export const upsertStreamUser = async function (userData) {
    try {
        // Upserts the user into the Stream system
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error(` Error upserting/creating Stream user:`, error);
    }
};

// 📌 Generate a Stream Chat token for a specific user ID
export const generateStreamToken = (userId) => {
    try {
        // Ensure the userId is a string
        const id = userId.toString();
        // Generate and return a Stream token
        return streamClient.createToken(id);
    } catch (error) {
        console.log(`Error generating Stream token: ${error.message}`);
    }
};
