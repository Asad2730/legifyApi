import { type Request, type Response } from 'express'

import upload from '../config/multer';
import { AuthenticateUser, SendPasswordResetLink, RegisterUserService, ChangePassword, ConfirmOtpCode, SendOtpCode } from '../services/user';

export const RegisterUser = async (req: Request, res: Response) => {
    upload.single('image')(req, res, async (err) => {
        if (err) return res.json({ message: 'Error uploading file', error: err.message });
    });

    try {
        const reqFile: string = req.file ? req.file.filename : ''
        const authService = await RegisterUserService({ ...req.body, imageUri: reqFile })
        return res.json(authService)
    } catch (ex) {
        return res.json(ex)
    }
}


export const LoginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const authService = await AuthenticateUser(email, password)
        return res.json(authService)
    } catch (ex) {
        return res.json(ex)
    }
}


export const ForgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const result = await SendPasswordResetLink(email)
       return res.json(result)
    } catch (ex) {
        return res.json(ex)
    }
}


export const ResetPassword = async (req: Request, res: Response) => {
    try {
        const { id, password, password_confirmation } = req.body
        const updateResponse = await ChangePassword(id, password, password_confirmation)
        return res.json(updateResponse)
    } catch (ex) {
        return res.json(ex)
    }
}


export const SendOtp = async(req:Request,res:Response)=> {
    try {
        const { email } = req.body
        const otpResponse = await SendOtpCode(email)
        return res.json(otpResponse)
    } catch (ex) {
        return res.json(ex)
    }
}



export const ConfirmOtp = async(req:Request,res:Response)=> {
    try {
        const { email ,otp} = req.body
        const otpResponse = await ConfirmOtpCode(email,otp)
        return res.json(otpResponse)
    } catch (ex) {
        return res.json(ex)
    }
}