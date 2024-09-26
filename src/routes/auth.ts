import { Router } from 'express';
import { ConfirmOtp, ForgotPassword, LoginUser, RegisterUser, ResetPassword, SendOtp } from '../controllers/auth';

const authRoutes = Router();

authRoutes.post('/signup', RegisterUser)
authRoutes.post('/login', LoginUser)
authRoutes.post('/forgot-password',ForgotPassword)
authRoutes.post('/reset-password',ResetPassword)
authRoutes.post('/resend-otpd',SendOtp)
authRoutes.post('/conformation-otp',ConfirmOtp)

export { authRoutes };