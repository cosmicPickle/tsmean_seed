import { before } from "mocha";
import { mongoose } from './configuration/db/mongo';
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