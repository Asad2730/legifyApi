import { Router } from 'express';
import { authRoutes } from './auth';
import { verifyToken } from '../middlewares/authMiddleware';
import { taskRoutes } from './task';
import { contactRoutes } from './contact';

const router = Router();

router.use('/auth',authRoutes)
router.use('/contact',verifyToken,contactRoutes)
router.use('/task',verifyToken,taskRoutes)

export default router