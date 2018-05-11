
import * as mongodb from 'mongodb'
import { connect, mongoConfig } from './../../configuration/db/mongo';
import { logger } from './AppLogger'

class AppMongoDriver {
    protected _client: mongodb.MongoClient = null;
    protected _db: mongodb.Db;
    async connect() {
        logger.info(`Connecting to mongodb`)
        this._client = await mongodb.MongoClient.connect(connect); 
        this._db = this._client.db(mongoConfig.db);
    }
    db() {
        return this._db;
    }
}

export let mongo = new AppMongoDriver();