import { AppError } from '../core/errors/AppError';

export class AppUnknownGroupError extends AppError {
    
    protected code = 1002;
    protected message = "Unknown group";
}

export let appUnknownGroupError = new AppUnknownGroupError;