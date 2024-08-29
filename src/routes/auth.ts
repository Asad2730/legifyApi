import { Router } from 'express';
import { LoginUser, RegisterUser } from '../controllers/auth';

const authRoutes = Router();

authRoutes.post('/signup', RegisterUser)
authRoutes.post('/login', LoginUser)

export { authRoutes };