import type { IAuth } from "../models/auth";
import Auth from "../models/auth";
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();


const secret:string = process.env.JWT_SECRET as string

export const RegisterUserService = async (auth: IAuth) => {
    const hashedPassword = await bcrypt.hash(auth.password, 10);
    if (!auth.name || !auth.password || !auth.email) return Promise.reject(`Name, email, and password must not be empty`)

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,14}$)/;
    if (!passwordRegex.test(auth.password)) return Promise.reject(`Password must be between 6 to 14 characters long, contain at
         least one uppercase letter and one special character`);

    const authBody = {
        name: auth.name,
        email: auth.email,
        password: hashedPassword,
        imageUri: auth.imageUri ? path.join('/src/uploads', auth.imageUri) : ''
    };
    const response = await Auth.create(authBody)
    if (response.errors) return Promise.reject(`Rejected Request with errors ${response.errors}`)
    return Promise.resolve(response)
}


export const AuthenticateUser = async(email:string,password:string)=>{
     const user = await Auth.findOne({email})
     if(!user) return Promise.reject(`Authentication failed! no user found with email id ${email}`)
     const passwordMatch = await bcrypt.compare(password,user.password)
    if(!passwordMatch)  return Promise.reject(`Authentication failed! invalid password`)
    
    const token:string = jwt.sign({userId:user.id},secret,{expiresIn:'2hr'})
    const response:any = {user,token}
    return Promise.resolve(response)
}