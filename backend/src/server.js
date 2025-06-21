import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path'


// 🛣️ Import route modules
import { router as authRoutes } from './routes/auth.route.js';
import { router as userRoutes } from './routes/users.route.js';
import { router as chatRoutes } from './routes/chat.route.js';

// 🔌 Import DB connection function
import { connectDB } from './lib/db.js';

// 🔧 Initialize Express app
const app = express();

// 🌱 Load environment variables from .env
dotenv.config();

// 📦 Parse incoming JSON requests
app.use(express.json());


// parse req client url
app.use(cors({
    origin: process.env.CLIENT_URL, // Allow requests from the client URL
    credentials: true, // Allow  frontend to send cookies with requests
}))

// 🍪 Parse cookies from incoming requests
app.use(cookieParser());

// 🌐 Load environment-defined port
const PORT = process.env.PORT;
const __dirname = path.resolve();

// 🔗 Connect to MongoDB
connectDB();

// 🔐 Mount routes with their respective base paths
app.use('/api/auth', authRoutes);   // Authentication routes
app.use('/api/users', userRoutes);  // User & friend-related routes
app.use('/api/chat', chatRoutes);   // Stream chat token route

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
}
// 🚀 Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
// Export the app for testing or further configuration