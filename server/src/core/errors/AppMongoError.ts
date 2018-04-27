import { AppError } from './AppError';

interface IMongoError extends Error {
    errors: Object 
}

export class AppMongoError extends AppError {
    
    protected code = 1001;
    protected message = "";
    
    parse<T extends Error|IMongoError>(err: T): AppMongoError  {
        if((<IMongoError>err).errors) {
            this.message = "mongoose_validation_error";
            this.payload = {
                invalid: Object.keys((<IMongoError>err).errors).map((key) => {
                    const e = (<IMongoError>err).errors[key];
                    return {
                        kind: e.kind,
                        path: e.path,
                        message: e.message,
                        value: e.value
                    }
                })
            }
        } else if (err.message.indexOf('duplicate key error') !== -1) {
            this.message = "mongoose_duplicate_key_error"; 
        } else {
            this.message = "mongoose_error"

            if(process.env.NODE_ENV == 'development') {
                this.payload = {
                    debug: err.message
                }
            }
        }
        return this;
    }
}