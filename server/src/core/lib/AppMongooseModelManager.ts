import { mongoose } from './../models/db/mongo/connection'
import { IBaseModel } from './../models/db/mongo/BaseDocument';
import { logger } from './AppLogger';
export class AppMongooseModelManager {
    private __models: IBaseModel<any>[] = [];
    private __indexesCreated: Promise<any>[] = [];

    waitIndexesCreated(): Promise<any> {
        logger.info("Waiting for MongoDB Indexes to be created.");

        const modelNames = mongoose.connection.modelNames();
    
        modelNames.forEach((name) => {
            this.__models.push(mongoose.connection.model(name) as IBaseModel<any>);
            let model = this.__models[this.__models.length-1];
            
            this.__indexesCreated.push(model.waitIndexesCreated())
        })
        
        return Promise.all(this.__indexesCreated).then((value) => {
            logger.info('MongoDB Indexes Created.');
            return value;
        }, (err) => {
            logger.error(err);
            return err;
        });
    }
}

export const appMongooseModelManager = new AppMongooseModelManager();
export default appMongooseModelManager;