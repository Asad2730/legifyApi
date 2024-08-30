import mongoose from "mongoose"
import type { IContact } from "../models/contact"
import { Task, TaskStatus, type ITask, type ITaskStatus } from "../models/task"
import { ContactByIDService } from "./contact"


export const CreateTaskService = async (taskBody: ITask): Promise<string> => {
    try {
        const { task_status, assigned_contact, ...rest_task } = taskBody

        const contacts = await Promise.all(assigned_contact.map(async (contactID) => {
            const contact: IContact = await ContactByIDService(contactID)
            if (!contact) return Promise.reject(`Contact not found against ${contactID}`)
            return contact._id
        }))

        const taskStatus: ITaskStatus = await TaskStatus.create(task_status)
        await Task.create({ task_status: taskStatus._id, assigned_contact: contacts, ...rest_task })

        return Promise.resolve(`Task Created Successfully`)
    } catch (err) {
        return Promise.reject(`Error Creating Task ${err}`)
    }
}

export const TaskListService = async (): Promise<ITask[]> => {
    try {
        const tasks: ITask[] = await Task.find().populate('taskStatus').populate('contact')
        return Promise.resolve(tasks)
    } catch (err) {
        return Promise.reject(`Error getting TaskList ${err}`)
    }
}


export const TaskByIdService = async (id: any): Promise<ITask> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return Promise.reject(`Invalid id format`)
        const task: ITask | null = await Task.findById(id).populate('taskStatus').populate('contact')
        if (!task) return Promise.reject(`contact not found!`)
        return Promise.resolve(task)
    } catch (err) {
        return Promise.reject(`Error getting Task ${err}`)
    }
}


export const TaskUpdateService = async(id:any,update_task:ITask):Promise<string> =>{
    try{
        const task:ITask = await TaskByIdService(id)
        await Task.updateOne(id,{$set:update_task})
        if(task.task_status) await TaskStatus.updateOne({_id:task._id},{$set:task.task_status})
        return Promise.resolve(`Task Updated Successfully`)
    }catch(err){
        return Promise.reject(`Error updating Task ${err}`)
    }
}


export const TaskDeleteService = async(id:any):Promise<string> =>{
    try{
        const task:ITask = await TaskByIdService(id)
        await Task.deleteOne(id)
        if(task.task_status) await TaskStatus.deleteOne({_id:task._id})
        return Promise.resolve(`Task Deleted Successfully`)
    }catch(err){
        return Promise.reject(`Error Deleting Task ${err}`)
    }
}


export const TaskStatusUpdateService = async(id:any,update_task_status:ITaskStatus):Promise<string> =>{
    try{
        const task:ITask = await TaskByIdService(id)
        if(task.task_status) await TaskStatus.updateOne({_id:task._id},{$set:update_task_status})
        return Promise.resolve(`Task Status Changed`)
    }catch(err){
        return Promise.reject(`Error updating Task ${err}`)
    }
}