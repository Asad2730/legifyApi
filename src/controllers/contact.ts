import { type Request, type Response } from 'express'
import { ContactByIDService, ContactListService, CreateContactService, DeleteContactService, UpdateContactService } from '../services/contact'


export const CreateContact = async (req: Request, res: Response) => {
    try {
        const rs = await CreateContactService(req.body)
        return res.json(`Contact created Successfully! ${rs}`)
    } catch (ex) {
        return res.json(ex)
    }
}


export const ContactList = async (req: Request, res: Response) => {
    try {
        const page = Number.parseInt(req.query.page as string) || 1
        const per_page = Number.parseInt(req.query.per_page as string) || 5
        const rs = await ContactListService(page,per_page)
        return res.json(rs)
    } catch (ex) {
        return res.json(ex)
    }
}


export const ContactByID = async(req: Request, res: Response) => {
    try {
        const id: any = req.query.contact_id
        const rs = await ContactByIDService(id)
        return res.json(rs)
    } catch (ex) {
        return res.json(ex)
    }
}



export const ContactUpdate = async(req: Request, res: Response) => {
    try {
        const id: any = req.params.id
        const rs = await UpdateContactService(id,req.body)
        return res.json(rs)
    } catch (ex) {
        return res.json(ex)
    }
}


export const ContactDelete = async(req: Request, res: Response) => {
    try {
        const id: any = req.params.id
        const rs = await DeleteContactService(id)
        return res.json(rs)
    } catch (ex) {
        return res.json(ex)
    }
}