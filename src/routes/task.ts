import { Router } from 'express';
import { CreateTask, DeleteTask, TaskById, TaskList, UpdateTask, UpdateTaskStatus } from '../controllers/task';



const taskRoutes = Router();

 taskRoutes.post('/',CreateTask)
 taskRoutes.get('/',TaskList)
 taskRoutes.get('/:id',TaskById)
 taskRoutes.put('/:id',UpdateTask)
 taskRoutes.delete('/:id',DeleteTask)
 taskRoutes.put('/status/:id',UpdateTaskStatus)

export { taskRoutes };