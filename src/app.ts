import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import taskRouter from './routes/task.router';
import db from './database/db';
import errorHandler from './error/app-error.controller';

const app = express();

app.use(logger(':method :url :status :date[web]'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/tasks', taskRouter);

// Centralized error-handling middleware
app.use(errorHandler);

// Database
db.connectToDb();

export default { app };
