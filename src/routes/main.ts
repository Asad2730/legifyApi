import { Router } from 'express';
import { authRoutes } from './auth';
import { verifyToken } from '../middlewares/authMiddleware';
import { taskRoutes } from './task';
import { contactRoutes } from './contact';

const router = Router();

router.use('/auth',authRoutes)
router.use('/management/contact',verifyToken,contactRoutes)
router.use('/management/task',verifyToken,taskRoutes)

export default router