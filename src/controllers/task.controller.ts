import { NextFunction, Request, Response } from 'express';
import AppError from '../error/app-error';
import { DateTime } from 'luxon';
import Task from '../models/task.model';
import { ITaskFilter } from '../interfaces/task-filter.interface';
import { RootFilterQuery, Types } from 'mongoose';
import { ITask } from '../interfaces/task.interface';
import { ETaskStatus } from '../enums/task-status.enum';
import { isEqual } from 'lodash';

const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, status, dueDate } = req.body;
        // Verifies that title, status or dueDate are not empty
        if (!title || !status || !dueDate) return next(new AppError('Title or Status or DueDate are empty', 400));

        // Verifies that tags property is an array and then clean it from repeated values by creating a Set
        let { tags } = req.body;
        if (!Array.isArray(tags)) return next(new AppError('Tags property is not an array', 400));
        tags = Array.from(new Set(tags));

        // Verifies that dueDate format is valid
        const dueDateIsValid = DateTime.fromISO(dueDate).isValid;
        if (!dueDateIsValid) return next(new AppError('DueDate has not a valid format', 400));

        const { description, priority } = req.body;
        const now = DateTime.now().toUTC().toISO();
        const taskToCreate: ITask = {
            title,
            description,
            status,
            priority,
            dueDate,
            tags,
            history: [{ change: 'Task has been created', date: now }]
        };
        const taskCreated = await Task.create(taskToCreate);
        // Returns the created task
        res.status(201).send({ task: taskCreated });
    } catch (error) {
        next(error);
    }
};

const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, priority, tags, startDate, endDate }: ITaskFilter = req.query;

        const queryFilter: RootFilterQuery<ITask> = { deletedAt: null };
        if (status) {
            queryFilter.status = status;
        }
        if (priority) {
            queryFilter.priority = priority;
        }
        if (tags) {
            queryFilter.tags = { $all: tags };
        }
        if (startDate && endDate) {
            // Here we validate that StartDate and EndDate are valid and EndDate is not before or equals to StartDate
            const startDateDT = DateTime.fromISO(startDate);
            const endDateDT = DateTime.fromISO(endDate);
            if (!startDateDT.isValid || !endDateDT.isValid) return next(new AppError('StartDate or EndDate have not a valid format', 400));
            if (endDateDT <= startDateDT) return next(new AppError('EndDate cannot be equal to or earlier than StartDate', 400));
            queryFilter.dueDate = { $gte: startDate, $lte: endDate };
        }

        const tasks = await Task.find(queryFilter).sort({ dueDate: 1 });
        res.status(200).send({ tasks });
    } catch (error) {
        next(error);
    }
};

const getDeletedTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, priority, tags, startDate, endDate }: ITaskFilter = req.query;

        const queryFilter: RootFilterQuery<ITask> = { deletedAt: { $ne: null } };
        if (status) {
            queryFilter.status = status;
        }
        if (priority) {
            queryFilter.priority = priority;
        }
        if (tags) {
            queryFilter.tags = { $all: tags };
        }
        if (startDate && endDate) {
            // Here we validate that StartDate and EndDate are valid and EndDate is not before or equals to StartDate
            const startDateDT = DateTime.fromISO(startDate);
            const endDateDT = DateTime.fromISO(endDate);
            if (!startDateDT.isValid || !endDateDT.isValid) return next(new AppError('StartDate or EndDate have not a valid format', 400));
            if (endDateDT <= startDateDT) return next(new AppError('EndDate cannot be equal to or earlier than StartDate', 400));
            queryFilter.dueDate = { $gte: startDate, $lte: endDate };
        }

        const tasks = await Task.find(queryFilter).sort({ dueDate: 1 });
        res.status(200).send({ tasks });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId: string = req.params.id;
        if (!taskId || !Types.ObjectId.isValid(taskId)) return next(new AppError('Task ID is invalid or empty', 400));

        const task = await Task.findOne({ _id: taskId, deletedAt: null });
        if (!task) return next(new AppError('Task not found', 404));

        res.status(200).send({ task });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId: string = req.params.id;
        if (!taskId || !Types.ObjectId.isValid(taskId)) return next(new AppError('Task ID is invalid or empty', 400));

        const { title, status, dueDate } = req.body;
        // Verifies that title, status or dueDate are not empty
        if (!title || !status || !dueDate) return next(new AppError('Title or Status or DueDate are empty', 400));

        // Verifies that tags property is an array and then clean it from repeated values by creating a Set
        let { tags } = req.body;
        if (!Array.isArray(tags)) return next(new AppError('Tags property is not an array', 400));
        tags = Array.from(new Set(tags));

        // Verifies that dueDate format is valid
        const dueDateDT = DateTime.fromISO(dueDate);
        const dueDateIsValid = dueDateDT.isValid;
        if (!dueDateIsValid) return next(new AppError('DueDate has not a valid format', 400));

        const existingTask = await Task.findOne({ _id: taskId, deletedAt: null });
        if (!existingTask) return next(new AppError('Task not found', 404));

        if (existingTask.status === ETaskStatus.Pending && status === ETaskStatus.Completed) {
            return next(new AppError('Cannot change status directly from Pending to Completed', 400));
        }

        // Compare what changed between the existing task values and the new values and register it into the history property
        const { description, priority } = req.body;
        let changeMessage = '';
        if (existingTask.title !== title) {
            changeMessage += `Title changed from '${existingTask.title}' to '${title}'.\n`;
        }
        if (existingTask.description !== description) {
            changeMessage += `Description changed from '${existingTask.description}' to '${description}'.\n`;
        }
        if (existingTask.status !== status) {
            changeMessage += `Status changed from '${existingTask.status}' to '${status}'.\n`;
        }
        if (existingTask.priority !== priority) {
            changeMessage += `Priority changed from '${existingTask.priority}' to '${priority}'.\n`;
        }
        const existingDueDateDT = DateTime.fromJSDate(existingTask.dueDate);
        const timeDifference = existingDueDateDT.diff(dueDateDT);
        if (Math.abs(timeDifference.milliseconds) > 0) {
            changeMessage += `DueDate changed from '${existingDueDateDT.toISO()}' to '${dueDateDT.toISO()}'.\n`;
        }
        if (!isEqual(existingTask.tags, tags)) {
            changeMessage += `Tags changed from '${existingTask.tags.toString()}' to '${tags.toString()}'.\n`;
        }

        const newTaskValues = {
            title,
            description,
            status,
            priority,
            dueDate,
            tags
        };
        if (changeMessage.length) {
            const now = DateTime.now().toUTC().toISO();
            existingTask.history.push({ change: changeMessage, date: now });
        }
        Object.assign(existingTask, newTaskValues);
        const taskUpdated = await existingTask.save();
        // Returns the updated task
        res.status(201).send({ task: taskUpdated });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId: string = req.params.id;
        if (!taskId || !Types.ObjectId.isValid(taskId)) return next(new AppError('Task ID is invalid or empty', 400));

        const existingTask = await Task.findOne({ _id: taskId, deletedAt: null });
        if (!existingTask) return next(new AppError('Task not found or already deleted', 404));

        const now = DateTime.now().toUTC().toISO();
        const newHistoryEvent = { change: 'Task has been soft deleted', date: now };
        await Task.updateOne({ _id: taskId }, { deletedAt: now, $push: { history: newHistoryEvent } });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const restoreTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId: string = req.params.id;
        if (!taskId || !Types.ObjectId.isValid(taskId)) return next(new AppError('Task ID is invalid or empty', 400));

        const existingTask = await Task.findOne({ _id: taskId, deletedAt: { $ne: null } });
        if (!existingTask) return next(new AppError('Task not found or already restored', 404));

        const now = DateTime.now().toUTC().toISO();
        const newHistoryEvent = { change: 'Task has been restored', date: now };
        const task = await Task.findOneAndUpdate({ _id: taskId }, { deletedAt: null, $push: { history: newHistoryEvent } }, { new: true });

        res.status(200).send({ task });
    } catch (error) {
        next(error);
    }
};

export default {
    createTask,
    getTasks,
    getDeletedTasks,
    getTaskById,
    updateTask,
    deleteTask,
    restoreTask
};
