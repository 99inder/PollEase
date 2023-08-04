const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        //retrieving data
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        //validations
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(404).json({
                success: false,
                message: "All required fields not received."
            })
        }
        //password validation
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password must be same."
            })
        }

        //check if user already exist
        const user = await User.findOne({ email });
        // return if user already exist
        if (user) {
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists."
            })
        }

        //create new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
        });
        // set password to undefined
        newUser.password = undefined;

        // return response
        return res.status(200).json({
            success: true,
            message: "Signup Successfull",
            data: newUser
        })

    } catch (error) {
        console.log("Error occured at userController 'signup' handler.");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                success: false,
                message: "All required fields must be filled."
            })
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "No user found with this email. Try Signing Up."
            })
        }

        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password - Unauthorized"
            })
        }

        const jwtPayload = {
            id: user._id,
            email: user.email,
        }
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });

        user.token = token;
        user.password = undefined;

        return res.status(200).cookie("token", token, { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) }).json({
            success: true,
            token: token,
            user: user,
            message: "Logged in successfully.",
        })
    } catch (error) {
        console.log("Error Occured at userController 'login'.");
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Login Failed. Please try again.",
            error: error.message
        });
    }
}