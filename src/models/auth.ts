import { model, Schema, type Document } from "mongoose";


export interface IAuth extends Document {
    name: string;
    email: string;
    password: string;
    imageUri: string;
    password_confirmation?: string; 
}



const AuthSchema: Schema<IAuth> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUri: { type: String, required: false },
})

AuthSchema.virtual('password_confirmation')
    .set(function(this: IAuth, value: string) {
        this.set('password_confirmation', value);
    })
    .get(function(this: IAuth) {
        return this.get('password_confirmation');
    });


AuthSchema.pre('validate', function(this: IAuth) {
    if (this.password !== this.password_confirmation) {
        throw new Error('Password and password confirmation do not match.');
    }
});

const Auth = model<IAuth>('auth', AuthSchema)

export default Auth;