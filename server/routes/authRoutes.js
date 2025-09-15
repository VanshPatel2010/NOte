import express from 'express';
import { isAuthenticated, login, logout, registerUser, resetPassword, sendResetOtp, sendVerificationOtp, verifyOtp } from '../controllers/authControllers.js';
import { userAuth } from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-otp', userAuth, sendVerificationOtp );
authRouter.post('/verify-otp',userAuth, verifyOtp);
authRouter.post('/is_auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);


export default authRouter;