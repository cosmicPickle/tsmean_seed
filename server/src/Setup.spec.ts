import { before } from "mocha";
import { User } from './models/db/mongo/UserDocument'
import { mongoose } from "./core/models/db/mongo/connection";
import { appMongooseModelManager } from './core/lib/AppMongooseModelManager';
import { logger } from "./core/lib/AppLogger";
before(async () => {
    try {
        await appMongooseModelManager.waitIndexesCreated();
    } catch (e) {
        logger.error(e);
    }
});

after(() => {
    mongoose.connection.close();
})