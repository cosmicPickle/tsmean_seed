import { AppError } from './AppError';

export class AppUnknownGroupError extends AppError {
    
    protected code = 1005;
    protected message = "Unknown group";
}

export let appUnknownGroupError = new AppUnknownGroupError;