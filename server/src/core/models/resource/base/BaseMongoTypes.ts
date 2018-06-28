import * as mongodb from 'mongodb';
import { IBaseMongoModel } from './IBaseMongoModel';

export class BaseMongoRelation<T extends IBaseMongoModel>  {
    public from: string
    public projections: {
        default: BaseMongoProjection<T>,
        [key: string] : BaseMongoProjection<T>
    };    
    public foreignField?: string
    public as?: string
    public isArray?: boolean

    constructor(init?: BaseMongoRelation<T>) {
        Object.assign(this, init);
    }
}

export interface BaseMongoModelConfig<T extends IBaseMongoModel> {
    resultsPerPage?: number;
    relations?: {
        [P in keyof T]?: BaseMongoRelation<any>
    }
    checkRelationsValidity?: boolean;
    filters?: string[]
}

export type BaseMongoProjection<T extends IBaseMongoModel> = {
    [P in keyof T]?: boolean | string
}

export type BaseMongoSort = {
    [key:string]: -1|1,
}

export type BaseMongoPagination = {
    skip: number,
    limit: number
}

export type BaseMongoLookup = Array<{
    $lookup: any
} | {
    $addField: any
}>

export interface InsertOneWriteOpResult<T> extends mongodb.InsertOneWriteOpResult {
    ops: T[];
}