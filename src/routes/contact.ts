import { Router } from 'express';
import { ContactByID, ContactDelete, ContactList, ContactUpdate, CreateContact } from '../controllers/contact';


const contactRoutes = Router();

contactRoutes.get('/',ContactList)
contactRoutes.get('/:id',ContactByID)
contactRoutes.post('/',CreateContact)
contactRoutes.put('/:id',ContactUpdate)
contactRoutes.delete('/:id',ContactDelete)


export { contactRoutes };