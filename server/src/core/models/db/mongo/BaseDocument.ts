
import { Document, Model, Schema, Mongoose } from "mongoose";
import { mongoose } from './connection';
import { Q, Deferred } from './../../../lib/Q';
import { logger } from "../../../lib/AppLogger";

export type BaseDocumentMethods = {
    [propName: string] : (...args: any[]) => any
}

export interface IBaseDocument {
    name: string;
    schema: any;
    methods?: BaseDocumentMethods;
    statics?: BaseDocumentMethods;
}

export interface IBaseModel<T extends Document> extends Model<T> {
    waitIndexesCreated(): Promise<any>;
}
export class BaseDocument<T extends Document> implements IBaseDocument {

    name: string;
    schema: any;
    methods: BaseDocumentMethods;
    statics: BaseDocumentMethods;
    protected __schema: Schema;
    private __indexesCreated: Deferred = (new Q).defer();

    private __waitIndexesCreated(): Promise<any> {
        return this.__indexesCreated.promise;
    }

    model(): IBaseModel<T> {
        this.__schema = new Schema(this.schema);
        this.__schema.methods = this.methods || {};
        this.__schema.statics = this.statics || {};
        this.__schema.static('waitIndexesCreated', () => {
            return this.__waitIndexesCreated();
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