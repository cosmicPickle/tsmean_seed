
import * as mongodb from 'mongodb'
import { connect, mongoConfig, connectTesting, mongoTestingConfig } from './../../configuration/db/mongo';
import { logger } from './AppLogger'
import { BaseMongoModel } from '../models/resource/base/BaseMongoModel';

type MongoConnectConfig = {
    testMode: boolean
}

type MongoSetupConfig = {
    createValidation: boolean,
    createIndexes: boolean
}

class AppMongoDriver {
    protected _models: BaseMongoModel<any>[] = [];
    protected _client: mongodb.MongoClient = null;
    protected _db: mongodb.Db;
    protected _connectConfig: MongoConnectConfig = {
        testMode: false
    }

    protected _setupConfig: MongoSetupConfig = {
        createValidation: false,
        createIndexes: false
    }

    async connect(connectConfig: Partial<MongoConnectConfig> = null) {

        let extendedConnectConfig = Object.assign({}, this._connectConfig, connectConfig);
        let selectedConnectString = (extendedConnectConfig.testMode ? connectTesting : connect);

        logger.info(`Connecting to mongodb` + (extendedConnectConfig.testMode ? `: INTEGRATION TEST DB` : ``));

        this._client = await mongodb.MongoClient.connect((extendedConnectConfig.testMode ? connectTesting : connect)); 
        this._db = this._client.db((extendedConnectConfig.testMode ? mongoTestingConfig.db : mongoConfig.db));
    }

    close() {
        this._client.close();
    }
    
    db() {
        return this._db;
    }

    async setup(setupConfig: Partial<MongoSetupConfig> = null) {

        if(!this._db) {
            throw new Error("No Database Selected");
        }

        let extendedSetupConfig = Object.assign({}, this._setupConfig, setupConfig);

        for(let i = 0; i < this._models.length; i++) {
            let model = this._models[i];

            try {
                if(extendedSetupConfig.createIndexes && model.schemaIndexes && model.schemaIndexes.length) {
                    
                    for(let j = 0; j < model.schemaIndexes.length; j++) {
                        await model.get().createIndex(model.schemaIndexes[j].keys, model.schemaIndexes[j].options);
                    }
                }
            
                if(extendedSetupConfig.createValidation && model.schemaValidation) {
                    this._db.command({
                        collMod: model.name,
                        validator: model.schemaValidation
                    })
                }
            } catch(e) {
                console.log(e);
                throw e;
            }
        }
    }

    addModel(model: BaseMongoModel<any>) {
        this._models.push(model);
    }

    models(): BaseMongoModel<any>[] {
        return this._models;
    }
}

export let mongo = new AppMongoDriver();