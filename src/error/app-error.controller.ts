import { Request, Response, NextFunction } from 'express';
import AppError from './app-error';

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    try {
        // Log the error
        console.error('App Error: ', err.stack);

        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';

        // Send the error response
        res.status(statusCode).send({
            status: 'error',
            message
        });
    } catch (error) {
        next(error);
    }
};

export default errorHandler;
