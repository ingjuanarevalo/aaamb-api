import express from 'express';
import taskController from '../controllers/task.controller';

const router = express.Router();

router.get('/', taskController.helloWorld);

export default router;
