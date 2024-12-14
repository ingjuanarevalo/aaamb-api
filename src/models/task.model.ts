import { Schema, model } from 'mongoose';
import { ITask } from '../interfaces/task.interface';
import { ETaskStatus } from '../enums/task-status.enum';
import { ETaskPriority } from '../enums/task-priority.enum';

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            minLength: [3, 'Title must be at least 3 characters']
        },
        description: {
            type: String,
            maxlength: [500, 'Description must be a maximum of 500 characters']
        },
        status: {
            type: String,
            required: true,
            enum: [...Object.values(ETaskStatus), '{VALUE} is not supported as a status value']
        },
        priority: {
            type: String,
            enum: [...Object.values(ETaskPriority), '{VALUE} is not supported as a priority value'],
            default: ETaskPriority.Medium
        },
        dueDate: {
            type: Date,
            required: true,
            validate: [(value: number) => value > Date.now(), 'Due date must be in the future']
        },
        tags: {
            type: [String],
            validate: [
                (value: Array<string>) => Array.isArray(value) && new Set(value).size === value.length,
                'Tags field must be an array of unique, not repeated, strings.'
            ]
        },
        history: [{ change: String, date: { type: Date, default: Date.now() } }],
        deletedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ tags: 1 });

const taskModel = model<ITask>('Task', taskSchema);

export default taskModel;
