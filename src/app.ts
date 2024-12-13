import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import taskRouter from './routes/task.router';

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/tasks', taskRouter);

export default { app };
