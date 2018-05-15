import { AppError } from './AppError';
import { MongoError } from 'mongodb';

export class AppMongoError extends AppError {
    
    protected code = 1001;
    protected message = "mongo_error";

    parse(err: MongoError) {
        this.debug(err);
        
        if(err.code === 11000) {
            let duplicateIndexArr = err.message.match(/duplicate key error index: (.*) dup key:/)[1].split('.');
            let duplicateIndex = duplicateIndexArr[duplicateIndexArr.length-1].match(/^\$(.*)_[0-9]*$/)[1];
            this.payload = {
                duplicateOn: duplicateIndex
            }
        }

        return this;
    }
}