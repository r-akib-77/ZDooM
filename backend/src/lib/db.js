import mongoose from "mongoose";

// Function to connect to MongoDB
export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI; // Get MongoDB URI from environment variables

        const connect = await mongoose.connect(mongoUri); // Connect to MongoDB

        console.log(`MongoDB Connected: ${connect.connection.host}`); // Log success message
    } catch (error) {
        console.log(`Error connecting to mongo db`, error); // Log error message
        process.exit(1); // Exit process with failure
    }
}
