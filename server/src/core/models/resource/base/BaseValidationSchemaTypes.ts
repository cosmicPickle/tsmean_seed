import { Request } from "express";

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
    token?: string;
    sort?: string;
    page?: number;
}

export interface AppBaseBody {
    token?: string;
}

export interface AppBaseRequest<T extends AppBaseQuery = AppBaseQuery, Q extends AppBaseBody = AppBaseBody> extends Request {
    query: T;
    body: Q;
}