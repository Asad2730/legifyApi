import type { NextFunction,  Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret:string = process.env.JWT_SECRET as string

declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;  
    }
}



export function verifyToken(req:Request,res:Response,next:NextFunction) {
   
    const token = req.header('Authorization');
    if (!token) return res.json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.json({ error: 'Invalid token' });
    }
};

export const isValidEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


export const isPasswordValid = (password:string)=> {
   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,14}$)/;
   return passwordRegex.test(password)
}



