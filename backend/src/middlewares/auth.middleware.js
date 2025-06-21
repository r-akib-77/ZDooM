import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized -  no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res
                .status(401)
                .json({ message: "Unauthorized - invaild token" });
        }

        const user = await User.findById(decoded.userId).select("-password -__v");

        if (!user) {
            return res
                .status(401)
                .json({ message: "Unauthorized - user not found" });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log(`error in protectRoute middleware`, error);
        res
            .status(500)
            .json({ message: "Internal server error - failed to authenticate" });
    }
}