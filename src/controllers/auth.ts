import { type Request, type Response } from 'express'

import upload from '../config/multer';
import { AuthenticateUser, RegisterUserService } from '../services/user';

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
        const authService = await AuthenticateUser(email,password)
        res.json(authService)
    } catch (ex) {
        return res.json(ex)
    }
}