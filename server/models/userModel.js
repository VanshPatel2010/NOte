import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        verifyOtp: {
            type: String,
            default:'',
        },
        verifyOtpExpiry: {
            type: Number,
            default: 0
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        resetOtp: {
            type: String,
            default: '',
        },
        resetOtpExpiry: {
            type: Number,
            default: 0
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        subscription:{
            type: String,
            enum: ["free", "pro"],
            default: "free",
        },
        tenants:{
            type: String,
            enum: ["Globex", "Acme"],
        },
        notes: {type:[noteSchema], default: []}
    },
    
);

const userModel = mongoose.model.user || mongoose.model("user", userSchema);
export default userModel;