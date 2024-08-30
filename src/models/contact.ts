import { model, Schema, type Document } from "mongoose";

export interface IContactInfo extends Document {
    email: string[];
    phone: string[];
    website: string[];
}

const ContactInfoSchema = new Schema<IContactInfo>({
    email: { type: [String], required: true, unique: true },
    phone: { type: [String], required: true },
    website: { type: [String], required: true },
});


export interface IContact extends Document {
    type: 'Company' | 'Individual';
    prefix: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    contact_info: IContactInfo['_id'];
    full_name?: string;
}


const ContactSchema = new Schema<IContact>({
    type: { type: String, enum: ['Company', 'Individual'], required: true },
    prefix: { type: String, required: true },
    first_name: { type: String, required: true },
    middle_name: { type: String, default: '' },
    last_name: { type: String, required: true },
    contact_info: { type: Schema.Types.ObjectId, ref: 'contactInfo', require: true }
})

ContactSchema.virtual('fullname').get(function (this: IContact) {
    return `${this.prefix} ${this.first_name} ${this.middle_name}${this.last_name}`
});

export const ContactInfo = model<IContactInfo>('contactInfo', ContactInfoSchema);
export const Contact = model<IContact>('contact', ContactSchema);