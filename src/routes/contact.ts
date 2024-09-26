import { Router } from 'express';
import { ContactByID, ContactDelete, ContactList, ContactUpdate, CreateContact } from '../controllers/contact';


const contactRoutes = Router();

contactRoutes.get('/list',ContactList)
contactRoutes.get('/detail',ContactByID)
contactRoutes.post('/store',CreateContact)
contactRoutes.put('/:id',ContactUpdate)
contactRoutes.delete('/delete/:id',ContactDelete)


export { contactRoutes };