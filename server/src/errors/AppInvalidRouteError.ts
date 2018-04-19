import { AppError } from '../core/errors/AppError';

export class AppInvalidRouteError extends AppError {
    
    protected code = 1004;
    protected message = "Invalid Route";
}

export let appInvalidRouteError = new AppInvalidRouteError();