
import { Document, Model, Schema, Mongoose, DocumentQuery } from "mongoose";
import { mongoose } from './connection';
import { Q, Deferred } from './../../../lib/Q';
import { logger } from "../../../lib/AppLogger";
import { AppBaseRequest } from "../../routing/request/AppBaseRequest";

export type BaseDocumentMethods = {
    [propName: string] : (...args: any[]) => any
}

export type DocumentConfig = {
    resultsPerPage: number;
}

export interface IBaseDocument {
    name: string;
    schema: any;
    methods?: BaseDocumentMethods;
    statics?: BaseDocumentMethods;
}

export interface IBaseModel<T extends Document> extends Model<T> {
    waitIndexesCreated(): Promise<any>;
    sortAndPagination<U extends AppBaseRequest<any, any>>(req: U): DocumentQuery<T[], T>;
    getConfig(): DocumentConfig;
}
export class BaseDocument<T extends Document> implements IBaseDocument {

    name: string;
    schema: any;
    methods: BaseDocumentMethods;
    statics: BaseDocumentMethods;
    config: DocumentConfig;

    protected __schema: Schema;
    private __indexesCreated: Deferred = (new Q).defer();
    private __waitIndexesCreated(): Promise<any> {
        return this.__indexesCreated.promise;
    }
    private __sortAndPagination<U extends AppBaseRequest<any, any>>(query:any, req: U): DocumentQuery<T[], T>{
        //This is NOT a query. This is a Model
        return query;
    }

    model(): IBaseModel<T> {
        const _this = this;
        this.__schema = new Schema(this.schema);
        this.__schema.methods = this.methods || {};
        this.__schema.statics = this.statics || {};
        this.__schema.static('waitIndexesCreated', () => {
            return this.__waitIndexesCreated();
        });
        this.__schema.static('getConfig', () => {
            return this.config;
        });

        logger.debug(`creating model ${this.name}`);
        let model = mongoose.model<T>(this.name, this.__schema) as IBaseModel<T>;
        model.ensureIndexes((err) => {
            if(err) {
                this.__indexesCreated.reject(err);
            } else {
                this.__indexesCreated.resolve()
            }
        });
        
        return model;
    }
}

export default BaseDocument;