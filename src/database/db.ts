import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const database = process.env.MONGO_DATABASE;

const connectToDb = async () => {
    try {
        await mongoose.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`);
        console.log('Successful connection with MongoDB');
    } catch (error) {
        console.log('There was an error with MongoDB connection: ', error);
    }
};

export default { connectToDb };
