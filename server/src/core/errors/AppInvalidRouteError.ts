import { AppError } from './AppError';

export class AppInvalidRouteError extends AppError {
    
    protected message = "invalid_route";
}