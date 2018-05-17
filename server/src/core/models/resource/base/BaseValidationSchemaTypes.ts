import { Request } from "express";
import { ObjectId } from "bson";

export namespace SchemaHelpers {
    export type AnySchema = boolean | string | number | Range | Lt | Gt | In;

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
export interface AppBaseQuery {
    sort?: string;
    page?: number;
}

export interface AppBaseBody {}

export interface AppBaseRequest<T extends AppBaseQuery = AppBaseQuery, Q extends AppBaseBody = AppBaseBody> extends Request {
    query: T;
    body: Q;
}