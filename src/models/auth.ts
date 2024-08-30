import { model, Schema, type Document } from "mongoose";


export interface IAuth extends Document {
    name: string;
    email: string;
    password: string;
    imageUri: string;
}



const AuthSchema: Schema<IAuth> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUri: { type: String, required: false },
})

const Auth = model<IAuth>('auth', AuthSchema)

export default Auth;