import { ETaskPriority } from '../enums/task-priority.enum';

export interface ITaskFilter {
    status?: string;
    priority?: ETaskPriority;
    tags?: Array<string>;
    startDate?: string;
    endDate?: string;
}
