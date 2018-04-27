import { AppError } from './AppError';

export class AppGeneralError extends AppError {
    protected message = "unexpected_error";
}