import { AppError } from '../core/errors/AppError';

export class AppUnknownUserError extends AppError {
    
    protected code = 1002;
    protected message = "Unknown user";
}

export let appUnknownUserError = new AppUnknownUserError;