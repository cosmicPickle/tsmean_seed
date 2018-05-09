
import * as types from './types';
import { Document, Model, Schema, Mongoose, DocumentQuery } from "mongoose";
import { mongoose } from './../../../../configuration/db/mongo';
import { Q, Deferred } from './../../../lib/Q';
import { logger } from "../../../lib/AppLogger";

export class BaseDocument<
    T extends Document, 
    U extends types.mongo.IBaseModel<T> = types.mongo.IBaseModel<T>, 
    V extends types.mongo.IBaseDocumentQuery<T> = types.mongo.IBaseDocumentQuery<T>
> implements types.mongo.IBaseDocument {

    name: string;
    schema: any;
    config: types.mongo.DocumentConfig = {
        resultsPerPage: 3
    };
    methods: types.mongo.BaseDocumentMethods;
    statics: types.mongo.BaseDocumentMethods;
    query: types.mongo.BaseDocumentMethods;
    private __methods:types.mongo.BaseDocumentMethods = {};
    private __statics:types.mongo.BaseDocumentMethods = {
        waitIndexesCreated: (): Promise<any> => {
            return this.__indexesCreated.promise;
        }
    };
    private __query: types.mongo.BaseDocumentMethods = {
        sortAndPaginate: (() => {
            const config = this.config;

            return function<R extends types.io.AppBaseRequest>(req: R): V {
                const q = (this as V);

                if(req.query.sort) {
                    q.sort(req.query.sort);
                }

                if(config.resultsPerPage > 0) {
                    const p = req.query.page >= 1 ? req.query.page : 1;
                    const skip = (p - 1)*config.resultsPerPage;
                    
                    q.skip(skip);
                    q.limit(config.resultsPerPage);
                }
                return q;
            }
            
        })()
    };

    private __schema: types.mongo.BaseSchema;
    private __indexesCreated: Deferred = (new Q).defer();
    model(): U {
        const _this = this;
        this.__schema = new types.mongo.BaseSchema(this.schema);
        this.__schema.methods = this.methods ? Object.assign({}, this.methods, this.__methods) : Object.assign({}, this.__methods);
        this.__schema.statics = this.statics ? Object.assign({}, this.statics, this.__statics) : Object.assign({}, this.__statics);
        this.__schema.query = this.query ? Object.assign({}, this.query, this.__query) : Object.assign({}, this.__query);

        logger.debug(`creating model ${this.name}`);
        let model = mongoose.model<T>(this.name, this.__schema) as U;
        model.ensureIndexes((err) => {
            if(err) {
                this.__indexesCreated.reject(err);
            } else {
                this.__indexesCreated.resolve();
            }
        });
        
        return model;
    }
}

export default BaseDocument;