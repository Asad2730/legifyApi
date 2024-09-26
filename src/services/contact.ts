import mongoose from "mongoose";
import { Contact, ContactInfo, type IContact, type IContactInfo } from "../models/contact";
import { isValidEmail,isValidPhoneNumber,isValidWebsite } from "../middlewares/authMiddleware";


const validateContactInfo = (contactInfo:IContactInfo):Promise<string>=>{
    if(!contactInfo.email.every(isValidEmail)) return Promise.reject(`one or more email adresses ar invalid`)
    if(!contactInfo.phone.every(isValidPhoneNumber)) return Promise.reject(`One or more phone nos are invalid`)
    if(!contactInfo.website.every(isValidWebsite)) return Promise.reject(`one or more website urls are invalid`)
    return Promise.resolve(`validation successful`)            
}

export const CreateContactService = async (body: IContact): Promise<string> => {
    try {
        const { contact_info, ...contactData } = body
        await validateContactInfo(contact_info as IContactInfo)
        const contactInfo: IContactInfo = await ContactInfo.create(contact_info)
        await Contact.create({ ...contactData, contact_info: contactInfo._id })
        return Promise.resolve(`Contact created Successfully`)
    } catch (err) {
        return Promise.reject(`Error Creating Contact ${err}`)
    }
}


interface IPaginatedContacts {
    current_page: number;
    data: IContact[];
    total: number;
    per_page: number;
}


export const ContactListService = async (page: number = 1, per_page: number = 5): Promise<IPaginatedContacts> => {
    try {
        const skip = (page - 1) * per_page
        const contacts: IContact[] = await Contact.find().populate('contactInfo')
            .skip(skip)
            .limit(per_page)
        const total: number = await Contact.countDocuments()

        return Promise.resolve({
            current_page: page,
            data: contacts,
            total: total,
            per_page: per_page
        })
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
        await validateContactInfo(contact.contact_info as IContactInfo)
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