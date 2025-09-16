import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
const app = express();
const port = process.env.PORT || 4000;
connectDB();
app.use(cors({
  origin: process.env.FRONTEND_URL, // your Vite frontend URL
  credentials: true,               // allow cookies if using withAuth
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(cookieParser());
app.use(express.json());

app.get("/",(req,res) => {res.send("Hello everyone")});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.listen(port, () => console.log(`Server started on port ${port}`));
