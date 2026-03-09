import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

export const protectedRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const user = await User.findById(decoded.userId).select("name email profilePic");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Error in protectedRoute middleware", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}