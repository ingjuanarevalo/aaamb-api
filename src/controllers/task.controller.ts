import { NextFunction, Request, Response } from 'express';

const helloWorld = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).send({ message: 'Hello AAAMB' });
    } catch (error) {
        next(error);
    }
};

export default {
    helloWorld
};
