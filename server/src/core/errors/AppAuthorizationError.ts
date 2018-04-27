import { AppError } from './AppError';

export class AppAuthorizationError extends AppError {
    protected message = "not_authorized";
}