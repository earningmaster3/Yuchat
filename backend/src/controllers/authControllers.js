import { generateToken } from "../lib/utils.js"
import User from "../models/usermodel.js"
import bcrypt from "bcrypt"

export const signup = async (req, res) => {
    try {

        const { email, fullName, password } = req.body

        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "input filed missing" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password must be 6 character" })
        }

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

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "input filed missing" })
        }

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