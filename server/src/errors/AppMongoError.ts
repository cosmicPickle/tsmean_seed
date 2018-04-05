import { AppError } from '../core/errors/AppError';

export class AppMongoError extends AppError {
    
    protected code = 1001;
    protected message = "Mongo Error";
}

export let appMongoError = new AppMongoError();