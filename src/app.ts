import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import taskRouter from './routes/task.router';
import db from './database/db';
import errorHandler from './error/app-error.controller';

const app = express();
const domainWhitelist = ['http://localhost:4200'];
const corsOptionsDelegate = {
    origin: (origin: string, callback: any) => {
        if (domainWhitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }
};

app.use(cors({ ...corsOptionsDelegate }));
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
