import { Request, Response } from 'express';

const helloWorld = async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: 'Hello AAAMB' });
    } catch (error) {
        console.log(error);
    }
};

export default {
    helloWorld
};
