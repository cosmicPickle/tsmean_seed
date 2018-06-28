
import { AppError } from './AppError';

export class AppUnknownEntityError extends AppError {
    protected message = "unknown_entity";
}

