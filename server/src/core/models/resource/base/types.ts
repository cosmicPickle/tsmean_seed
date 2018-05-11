import { Model, Document, DocumentQuery, Schema } from "mongoose";
import { Request } from "express";


/**
 * IO Types
 */

export namespace io {
    export interface AppBaseQuery {
        token?: string;
        sort?: string;
        order?: -1|1;
        page?: number;
    }

    export namespace SchemaHelpers {
        export interface Range {
            lt: number,
            gt: number
        }
        export interface Lt {
            lt: number;
        }
        export interface Gt {
            gt: number;
        }
        export interface In {
            in: string[]
        }
    }
    
    export interface AppBaseBody {
        token?: string;
    }
    
    export interface AppBaseRequest<T extends AppBaseQuery = AppBaseQuery, Q extends AppBaseBody = AppBaseBody> extends Request {
        query: T;
        body: Q;
    }
}

/**
 * Mongodb Types
 */
export namespace mongo {
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
        sortAndPaginate<R extends io.AppBaseRequest>(req: R): this;
    }
    
    export class BaseSchema extends Schema {
        query: BaseDocumentMethods;
    }
}

