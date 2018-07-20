
import { AppError } from './AppError';

export class AppNotFound extends AppError {
    protected message = "not_found";
}

