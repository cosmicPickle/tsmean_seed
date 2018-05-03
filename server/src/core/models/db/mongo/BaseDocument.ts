import { BaseDocumentMethods } from './BaseDocument';
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
}

export interface IBaseDocumentQuery<DocType extends Document> extends DocumentQuery<DocType[], DocType> {
    sortAndPaginate<R extends AppBaseRequest>(req: R): this;
}

export class BaseSchema extends Schema {
    query: BaseDocumentMethods;
}

export class BaseDocument<
    T extends Document, 
    U extends IBaseModel<T> = IBaseModel<T>, 
    V extends IBaseDocumentQuery<T> = IBaseDocumentQuery<T>
> implements IBaseDocument {

    name: string;
    schema: any;
    config: DocumentConfig = {
        resultsPerPage: 3
    };
    methods: BaseDocumentMethods;
    statics: BaseDocumentMethods;
    query: BaseDocumentMethods;
    private __methods:BaseDocumentMethods = {};
    private __statics:BaseDocumentMethods = {
        waitIndexesCreated: (): Promise<any> => {
            return this.__indexesCreated.promise;
        }
    };
    private __query: BaseDocumentMethods = {
        sortAndPaginate: (() => {
            const config = this.config;

            return function<R extends AppBaseRequest>(req: R): V {
                const q = (this as V);

                if(req.query.sort && req.query.order) {

                    const sort:any = {};
                    sort[req.query.sort] = req.query.order;

                    q.sort(sort);
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

    private __schema: BaseSchema;
    private __indexesCreated: Deferred = (new Q).defer();
    model(): U {
        const _this = this;
        this.__schema = new BaseSchema(this.schema);
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