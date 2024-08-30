import mongoose from "mongoose";
import { Contact, ContactInfo, type IContact, type IContactInfo } from "../models/contact";



export const CreateContactService = async (body: IContact): Promise<string> => {
    try {
        const { contact_info, ...contactData } = body
        const contactInfo: IContactInfo = await ContactInfo.create(contact_info)
        await Contact.create({ ...contactData, contact_info: contactInfo._id })
        return Promise.resolve(`Contact created Successfully`)
    } catch (err) {
        return Promise.reject(`Error Creating Contact ${err}`)
    }
}


export const ContactListService = async (): Promise<IContact[]> => {
    try {
        const contacts: IContact[] = await Contact.find().populate('contactInfo')
        return Promise.resolve(contacts)
    } catch (err) {
        return Promise.reject(`Error getting Contacts ${err}`)
    }
}


export const ContactByIDService = async (id: any): Promise<IContact> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return Promise.reject(`Invalid id format`)
        const contact: IContact | null = await Contact.findById(id).populate('contactInfo')
        if (!contact) return Promise.reject(`contact not found!`)
        return Promise.resolve(contact)
    } catch (err) {
        return Promise.reject(`Error getting Contact ${err}`)
    }
}


export const UpdateContactService = async (id: any, contact: IContact): Promise<string> => {
    try {
        const update_contact: IContact = await ContactByIDService(id)
        await Contact.updateOne(id, { $set: contact })
        if (contact.contact_info) await ContactInfo.updateOne({ _id: update_contact.contact_info }, { $set: contact.contact_info })
        return Promise.resolve(`Contact Updated Successfully!`)
    } catch (err) {
        return Promise.reject(`Error updating Contact ${err}`)
    }
}


export const DeleteContactService = async (id: any): Promise<string> => {
    try {
        const contact: IContact = await ContactByIDService(id)      
        await Contact.deleteOne({ _id: contact.id })
        await ContactInfo.deleteOne({ _id: contact.contact_info })
        return Promise.resolve(`Contact Deleted Successfully!`)
    } catch (err) {
        return Promise.reject(`Error Deleting Contact ${err}`)
    }
}