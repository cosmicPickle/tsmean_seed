import { isArray } from "util";

export type BaseMongoRelation = {
    from: string,
    localField: string,
    foreignField?: string;
    as?: string,
    isArray?: boolean
}

export interface BaseMongoModelConfig {
    resultsPerPage?: number;
    relations?: BaseMongoRelation[];
    checkRelationsValidity?: boolean;
    filters?: string[]
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