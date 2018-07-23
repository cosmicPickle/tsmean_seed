
import { AppError } from './AppError';

export class AppDuplicateLogin extends AppError {
    protected message = "duplicate_login";
}

