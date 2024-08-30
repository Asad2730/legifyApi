import { Document, model, Schema } from "mongoose";
import type { IContact } from "./contact";

export interface ITaskStatus extends Document {
    status: 'Pedning' | 'InComplete' | 'Complete';
    priority: 'High' | 'Medium' | 'Low';
}


const TaskStatus_Schema = new Schema<ITaskStatus>({
    status: { type: String, enum: ['Pending', 'InComplete', 'Complete'], required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
});

export interface ITask extends Document {
    name: string;
    description: string;
    asign_date: string;
    submision_date: string;
    isPrivate: boolean;
    task_status: ITaskStatus['_id'];
    assigned_contact: IContact['_id'][];
}


const TaskSchema = new Schema<ITask>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    asign_date: { type: String, required: true },
    submision_date: { type: String },
    isPrivate: { type: Boolean, required: true },
    task_status: { type: Schema.Types.ObjectId, ref: 'taskStatus', require: true },
    assigned_contact: { type: [Schema.Types.ObjectId], ref: 'contact', require: true }
});


export const TaskStatus = model<ITaskStatus>('taskStatus', TaskStatus_Schema)
export const Task = model<ITask>('task', TaskSchema)