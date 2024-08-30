import { type Request, type Response } from 'express'
import { CreateTaskService, TaskByIdService, TaskDeleteService, TaskListService, TaskStatusUpdateService, TaskUpdateService } from '../services/task'


export const CreateTask = async (req: Request, res: Response) => {
    try {
        const rs = await CreateTaskService(req.body)
        return res.json(rs)
    } catch (err) {
        return res.json(err)
    }
}



export const TaskList = async (req: Request, res: Response) => {
    try {
        const rs = await TaskListService()
        return res.json(rs)
    } catch (err) {
        return res.json(err)
    }
}



export const TaskById = async (req: Request, res: Response) => {
    try {
        const id: any = req.params.id
        const rs = await TaskByIdService(id)
        return res.json(rs)
    } catch (err) {
        return res.json(err)
    }
}



export const UpdateTask = async (req: Request, res: Response) => {
    try {
        const id: any = req.params.id
        const rs = await TaskUpdateService(id, req.body)
        return res.json(rs)
    } catch (err) {
        return res.json(err)
    }
}


export const DeleteTask = async (req: Request, res: Response) => {
    try {
        const id: any = req.params.id
        const rs = await TaskDeleteService(id)
        return res.json(rs)
    } catch (err) {
        return res.json(err)
    }
}



export const UpdateTaskStatus = async (req: Request, res: Response) => {
    try {
        const id: any = req.params.id
        const rs = await TaskStatusUpdateService(id,req.body)
        return res.json(rs)
    } catch (err) {
        return res.json(err)
    }
}