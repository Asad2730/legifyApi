import type { IAuth } from "../models/auth";
import Auth from "../models/auth";
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { isPasswordValid, isValidEmail } from "../middlewares/authMiddleware";
import nodemailer from 'nodemailer';
import mongoose from "mongoose";
dotenv.config();


const secret: string = process.env.JWT_SECRET as string

export const RegisterUserService = async (auth: IAuth) => {
  try {
    
    
    if (!auth.name || !auth.password || !auth.email) return Promise.reject(`Name, email, and password must not be empty`)

    if (!isValidEmail(auth.email)) return Promise.reject(`Email id  not valid`)

    if (!isPasswordValid(auth.password)) return Promise.reject(`Password must be between 6 to 14 characters long, contain at
      least one uppercase letter and one special character`);

    const hashedPassword = await bcrypt.hash(auth.password, 10);

    const authBody = {
      name: auth.name,
      email: auth.email,
      password: hashedPassword,
      imageUri: auth.imageUri ? path.join('/src/uploads', auth.imageUri) : ''
    };
    const response = await Auth.create(authBody)
    if (response.errors) return Promise.reject(`Rejected Request with errors ${response.errors}`)
    return Promise.resolve(response)
  } catch (err) {
    return Promise.reject(`Error Registering User ${err}`)
  }
}


export const AuthenticateUser = async (email: string, password: string) => {
  try {
    const user = await Auth.findOne({ email })
    if (!user) return Promise.reject(`Authentication failed! no user found with email id ${email}`)
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return Promise.reject(`Authentication failed! invalid password`)

    const token: string = jwt.sign({ userId: user.id }, secret, { expiresIn: '2hr' })
    const response: any = { user, token }
    return Promise.resolve(response)
  } catch (err) {
    return Promise.reject(`Error Authenticating User ${err}`)
  }
}




export const SendPasswordResetLink = async (email: string) => {
  try {
    if (!isValidEmail(email)) return Promise.reject(`Email id not valid`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      }
    });

    const resetLink = `https://yourdomain.com/reset-password?email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
    };

    await transporter.sendMail(mailOptions);
    return Promise.resolve(`Reset password email sent successfully.`);
  } catch (err) {
    return Promise.reject(`Error generating link for reset password: ${err}`);
  }
};



export const ChangePassword = async (id: any, password: string, password_confirmation: string) => {
  try {
    if (password !== password_confirmation) return Promise.reject(`Password and confirm password should be the same!`);
    if (!isPasswordValid(password)) return Promise.reject(`Password must be between 6 to 14 characters long, contain at least one uppercase letter and one special character.`);

    if (!mongoose.isValidObjectId(id)) return Promise.reject(`Id is not valid.`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const update_user = await Auth.updateOne({ _id: id }, { password: hashedPassword });

    if (!update_user.acknowledged) return Promise.reject(`Error updating password: ${JSON.stringify(update_user)}`);

    return Promise.resolve(`Password updated successfully!`);
  } catch (err) {
    return Promise.reject(`Error changing password: ${err}`);
  }
}


// Store OTPs temporarily (in-memory), for a production system use Redis or database.
const otps: Record<string, { otp: string; expires: number }> = {};
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const SendOtpCode = async (email: string) => {
  try {
    if (!isValidEmail(email)) return Promise.reject('Email id not valid');


    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expires = Date.now() + 5 * 60 * 1000;
    otps[email] = { otp: hashedOtp, expires };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. This code is valid for 5 minutes.`,
      html: `<p>Your OTP code is: <strong>${otp}</strong>. This code is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return Promise.resolve(`OTP sent successfully to ${email}`);
  } catch (err) {
    return Promise.reject(`Error sending OTP: ${err}`);
  }
};

export const ConfirmOtpCode = async (email: string, otp: string) => {
  try {
    const storedOtpData = otps[email];
    if (!storedOtpData) return Promise.reject('No OTP found for this email');

    const { otp: hashedOtp, expires } = storedOtpData;

    if (Date.now() > expires) return Promise.reject('OTP has expired');

    const isOtpValid = await bcrypt.compare(otp, hashedOtp);
    if (!isOtpValid) return Promise.reject('Invalid OTP');

    delete otps[email];
    return Promise.resolve('OTP confirmed successfully');
  } catch (err) {
    return Promise.reject(`Error confirming OTP: ${err}`);
  }
};




