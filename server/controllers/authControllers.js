import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
export const registerUser = async (req, res) => {

    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({message: "Please fill all the fields"});
    }

    try {
        const userExists = await userModel.findOne({email});
        if(userExists) {
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({name, email, password: hashedPassword});
        await newUser.save();
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV=== "production" ? "none" : "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Email Verification",
            text: `Your account is created successfully with eamilId: ${email}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        })
        return res.status(201).json({success: true, message: "User registered successfully", data : {name: newUser.name, email: newUser.email}});
    } catch (error) {
        res.json({success: false, message: error.message});
        console.log(error);
    }
}

export const login = async (req, res) => {

    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "Please fill all the fields"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({message: "User does not exist"});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({message: "Password is incorrect"});
            }
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
                expiresIn: "7d"
            })
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                // sameSite: "none",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({success: true, message: "User logged in successfully", data: {name: user.name, email: user.email, role: user.role, tenant: user.tenants}});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {
    
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            // sameSite: "Lax",
            path: "/",
        });
        return res.status(200).json({success: true, message: "User logged out successfully"});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const sendVerificationOtp = async (req, res) => {
    const {userId} = req.user.id;
    try {
        const user = await userModel.findOne({userId});
        if(!user) {
            return res.status(400).json({message: "User does not exist"});
        }
        if(user.isVerified) {
            return res.status(400).json({message: "User is already verified"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Email Verification",
            text: `Your verification otp is: ${otp}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        })    
        return res.status(200).json({success: true, message: "Otp sent successfully"});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const verifyOtp = async (req, res) => {
    const {userId, otp} = req.body;
    try {
        const user = await userModel.findOne({userId});
        if(!user) {
            return res.status(400).json({message: "User does not exist"});
        }
        if(user.verifyOtp !== otp || user.verifyOtp === '') {
            return res.status(400).json({message: "Invalid otp"});
        }
        if(user.verifyOtpExpiry < Date.now()) {
            return res.status(400).json({message: "Otp expired"});
        }
        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiry = 0;
        await user.save();
        return res.status(200).json({success: true, message: "User verified successfully"});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({success: true, message: "User is authenticated"});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const sendResetOtp = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({message: "email does not exist"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset otp",
            text: `Your reset otp is: ${otp}`
        }
        await transporter.sendMail(mailOptions)
        return res.status(200).json({success: true, message: "Otp sent successfully"});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

export const resetPassword = async (req, res) =>{
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword) {
        return res.status(400).json({message: "All fields are required"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({message: "email does not exist"});
            }
            if(user.resetOtpExpiry < Date.now()) {
                return res.status(400).json({message: "Otp expired"});
            }
            if(user.resetOtp !== otp || user.resetOtp === '') {
                return res.status(400).json({message: "Invalid otp"});
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetOtp = '';
            user.resetOtpExpiry = 0;
            await user.save();
            return res.status(200).json({success: true, message: "Password reset successfully"});
    } catch (error) {
        return res.status(400).json({success: false, message: error.message});
    }
}

