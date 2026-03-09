import { generateToken } from "../lib/utils.js"
import User from "../models/usermodel.js"
import bcrypt from "bcrypt"
import { signupSchema, loginSchema } from "../lib/schemas.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    try {
        const validation = signupSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ message: validation.error.issues[0]?.message || "Validation Error" });
        }

        const { email, fullName, password } = validation.data;

        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: "user is already exist" })
        }

        //salting password

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            fullName,
            password: hashedpassword,
        });

        if (newUser) {
            // generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (err) {
        console.log("Error in signup controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ message: validation.error.issues[0]?.message || "Validation Error" });
        }

        const { email, password } = validation.data;

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateToken(user._id, res)

        res.status(200).json({
            message: "user logged in successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (err) {
        console.log("Error in login controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {

        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        res.status(200).json({ message: "user logged out successfully" });

    } catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateprofile = async (req, res) => {
    try {

        const { profilePic } = req.body;

        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "profile pic is required" })
        }

        const uploaderResponse = await cloudinary.uploader.upload(profilePic)

        const user = await User.findByIdAndUpdate(userId, { profilePic: uploaderResponse.secure_url }, { new: true })

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        res.status(200).json({
            message: "profile updated successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })


    } catch (err) {
        console.log("Error in updateprofile controller", err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const checkAuth = async (req, res) => {
    try {

        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        res.status(200).json({
            message: "user authenticated successfully",
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (err) {
        console.log("Error in checkAuth controller", err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}