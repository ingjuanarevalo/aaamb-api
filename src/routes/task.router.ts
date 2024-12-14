import express from 'express';
import taskController from '../controllers/task.controller';

const router = express.Router();

router.post('/', taskController.createTask);

router.get('/', taskController.getTasks);

router.get('/deleted', taskController.getDeletedTasks);

router.get('/:id', taskController.getTaskById);

router.put('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

router.patch('/:id/restore', taskController.restoreTask);

export default router;
