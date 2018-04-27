import { AppError } from './AppError';

export class AppUnknownUserError extends AppError {
    protected message = "unknown_user";
}

