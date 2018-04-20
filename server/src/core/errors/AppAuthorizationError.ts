import { AppError } from './AppError';

export class AppAuthorizationError extends AppError {
    
    protected code = 1003;
    protected message = "You are not authorized to see this content.";
}

export let appAuthorizationError = new AppAuthorizationError();