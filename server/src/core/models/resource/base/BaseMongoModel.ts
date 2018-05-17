import { mongo } from './../../../lib/AppMongoDriver';
import * as mongodb from 'mongodb';
import { AppBaseRequest, AppBaseQuery, AppBaseBody } from './BaseValidationSchemaTypes';
import * as types from './BaseMongoTypes';
import { IBaseMongoModel } from './IBaseMongoModel';

export class BaseMongoModel<T extends IBaseMongoModel> implements types.BaseMongoModelConfig {
    name: string;
    /**
     * @property String[]
     * 
     * Denotes by which fields a collection is filterable
     */
    filters: string[] = [];
    /**
     * @property Number
     * @default 10
     * 
     * How many results will be returned on each page by the read operation
     */
    resultsPerPage = 10;
    /**
     * @property types.BaseMongoRelation[]
     * 
     * This configuration explains any one-to-one or one-to-many relations
     * that the model may have. It is used to perform a $lookup operation
     * on reading and when checking for valid relation ids when inserting
     * or updating a document
     */
    relations: types.BaseMongoRelation[];
    /**
     * @property Boolean
     * @default true
     * 
     * If set to true will perform a relation check before inserting or 
     * updating a document
     */
    checkRelationsValidity = true;
    /**
     * @property Boolean
     * @default false
     * 
     * If set to true, instead of deleting documents from the database, 
     * a __delete property will be added at the document root level
     */
    enableSoftDelete = false;
    
    /**
     * @property mongodb.Collection<T>
     * 
     * The current collection
     */
    protected collection: mongodb.Collection<T>;

    /**
     * @function get
     * 
     * Connects the model to a specific mongodb collection and returns it
     * 
     * @returns mongodb.Collection<T>
     * @throws Error if the model name is not defined 
     */
    get(): mongodb.Collection<T> {
        if(this.collection)
            return this.collection;

        
        if(!this.name) {
            throw new Error(`Can't make collection '${this.constructor.prototype}': 'name' not set`);
        }

        this.collection = mongo.db().collection(this.name);
        return this.collection;
    }

    /**
     * @function read
     * 
     * Filters, paginates and sorts a collection based on a request and the model configuration
     * 
     * @param req R extends AppBaseRequest
     * @returns Promise<T[]>
     * @throws Error if this.collection is undefined
     * @throws MongoError if there was a problem with the read
     */
    read<R extends AppBaseRequest>(req: R): Promise<T[]> {
        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        if(this.relations && this.relations.length) 
            return this._readAggregation(req);

        return this._readSimple(req);
    }

    /**
     * @function create
     * 
     * Validates any fields that are specified as relation fields if property checkRelationsValidity 
     * is set. Executes any pre-save hooks and creates a new document
     * 
     * @param req B extends AppBaseBody
     * @returns Promise<void>
     * @throws Error if this.collection is undefined
     * @throws Error if any of the relation ids provided is invalid
     * @throws Error if pre-save hook fails
     * @throws MongoError if there was a problem with the create or relation validation
     */
    async create<B extends AppBaseBody>(entity: B): Promise<mongodb.InsertOneWriteOpResult> {
        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        if(this.relations && this.checkRelationsValidity) {     
            const validated = await this._validateRelations(entity);

            if(validated === false)
                throw new Error(`Invalid relation.`)

            entity = Object.assign({}, entity, validated);
        }

        if((this as any).onPreSave)
            if((this as any).onPreSave(entity) === false)
                throw new Error(`Pre-save operation failed`);

        return this.collection.insertOne(entity as any as T);
    }

    /**
     * @function update
     * 
     * Same as create only updates an existing document. 
     * 
     * @param id string | number | mongodb.ObjectId
     * @param entity B extends AppBaseBody
     * @param by keyof T @default '_id'
     * @returns Promise<mongodb.UpdateWriteOpResult>
     * @throws Error if this.collection is undefined
     * @throws Error if any of the relation ids provided is invalid
     * @throws Error if pre-save hook fails
     * @throws MongoError if there was a problem with the update or relation validation
     */
    async update<B extends AppBaseBody>(
        id: string | number | mongodb.ObjectId, 
        entity: B,
        by: keyof T = '_id'): Promise<mongodb.UpdateWriteOpResult>{

        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }
        
        if(this.relations && this.checkRelationsValidity) {     
            const validated = await this._validateRelations(entity);

            if(validated === false)
                throw new Error(`Invalid relation.`)

            entity = Object.assign({}, entity, validated);
        }

        if((this as any).onPreSave)
            if((this as any).onPreSave(entity) === false)
                throw new Error(`Pre-save operation failed`);

        let query: any = {};
        query[by] = id;
        return this.collection.updateOne(query, {
            $set: entity
        });
    }

    /**
     * @function delete
     * 
     * Deletes a document by id or a unique field. If soft delete is enabled
     * adds a __delete:true property on the document
     * 
     * @param id string | number | mongodb.ObjectId
     * @param by keyof T @default '_id'
     * @returns Promise<mongodb.UpdateWriteOpResult>
     * @throws Error if this.collection is undefined
     * @throws MongoError if there was a problem with the create or relation validation
     */
    async delete<B extends AppBaseBody>(
        id: string | number | mongodb.ObjectId, 
        by: keyof T = '_id'
    ): Promise<mongodb.DeleteWriteOpResultObject> {

        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        let query: any = {};
        query[by] = id;

        if(this.enableSoftDelete) {
            const res = await this.collection.updateOne(query, {
                $set: {
                    __deleted: true
                }
            });
            
            return {
                result: res.result,
                deletedCount: res.modifiedCount,
                connection: res.connection
            } as mongodb.DeleteWriteOpResultObject
        }
        
        return this.collection.deleteOne(query)
    }

    /**
     * @function getFind
     * 
     *  Takes a request query or body and returns an object you can use in 
     *  the find part of a mongo query based on the allowed filters per model
     * 
     * @param input P extends AppBaseQuery | AppBaseBody
     * @returns any
     */
    getFind<P extends AppBaseQuery | AppBaseBody>(input: P)  {

        if(!this.filters || !this.filters.length) 
            return null;
        
        const filters = this.filters;
        let find:any = {};
        filters.forEach((f) => {
            if(!input[f])
                return;
            
            //The parser function tries to parse in operators like $gt, $lt etc.
            find[f] = this._parseFilter(input[f]);
        });

        return Object.keys(find).length ? find : null;
    }

    /**
     * @function getSort
     * 
     * Takes a a sort query string (eg age|-age) and tries to resolve sort field and direction. 
     * 
     * @param sortQuery string
     * @returns BaseMongoSort
     */
    getSort(sortQuery: string): types.BaseMongoSort {

        if(!sortQuery)
            return null;
        
        let sort: types.BaseMongoSort = {};
        const reverse = /^\-/.test(sortQuery);
        sort[!reverse ? sortQuery : sortQuery.substr(1)] = reverse ? -1 : 1;

        return sort;
    }

    /**
     * @function getPagination
     * 
     * Takes a number of page and tries to resolve how many items to show and how many
     * to skip based on the resultsPerPage model configuration
     * 
     * @param req number
     * @returns BaseMongoPagination
     */
    getPagination(page: number): types.BaseMongoPagination {
        if(!this.resultsPerPage)
            return null;

        page = page >= 1 ? page : 1;
        const skip = (page - 1) * this.resultsPerPage;

        const limit = this.resultsPerPage;
        return { skip, limit };
    }

    /**
     * @function getLookup
     * 
     * If there are any relations configured on the model, this function formulates an array
     * which can be used as a $lookup operator in a mongo aggregation.
     * 
     * @returns $lookup operations array
     */
    getLookup(): types.BaseMongoLookup {
        let lookupArr = [];
        
        if(!this.relations)
            return lookupArr;

        this.relations.forEach((rel) => {

            //If we don't have an 'as' field specified in the relation
            //we are just gonna use the localField
            const _as = rel.as ? rel.as : rel.localField;
            //Most often the foreign field will be the document _id
            const foreignField = rel.foreignField ? rel.foreignField : '_id';

            let lookup = {
                $lookup: {
                    from: rel.from,
                    localField: rel.localField,
                    foreignField: foreignField,
                    as: _as
                }
            }
            lookupArr.push(lookup);

            //By default the lookup always joins an array of matches
            //if the relation is not many-to-many, we want to replace 
            //the array with just the one item it contains
            if(!rel.isArray) {
                let addFields: any = {
                    $addFields: {}
                };

                addFields.$addFields[_as] = { 
                    $arrayElemAt: [ `\$${_as}`, 0]
                }
                
                lookupArr.push(addFields);
            } 
        });

        return lookupArr;
    }
    
    /**
     * @function _parseFilter
     * 
     * If the filter is not an object doesn't do any parsing. If the filter
     * is an object, this function tries to map operations to actual mongo
     * operations (in -> $in)
     * 
     * @param filter any
     * @returns a parsed filter
     */
    private _parseFilter(filter: any) {
        let parsed: any;
        if(typeof filter === 'object') {
            for (const key in filter) { 
                if (filter.hasOwnProperty(key)) {
                    parsed['$' + key] = filter[key];
                }
            }
        } else {
            parsed = filter;
        }

        return parsed;
    }

    /**
     * @function _readSimple
     * 
     * Performs a simple read operation on a model. Performs a filtering, sorting and
     * pagination of the data
     * 
     * @param req R extends AppBaseRequest
     * @returns Promise<T[]>
     */
    private _readSimple<R extends AppBaseRequest>(req: R): Promise<T[]> {

        const find = this.getFind(req.query);
        const sort = this.getSort(req.query.sort);
        const { skip, limit } = this.getPagination(req.query.page);

        let cursor = this.collection.find(find ? find: null);
        
        if(sort !== null)
            cursor = cursor.sort(sort);
        
        if(skip !== null)
            cursor = cursor.skip(skip);
        
        if(limit !== null)
            cursor = cursor.limit(limit);

        return cursor.toArray();
    }

    /**
     * @method _readAggregation
     * 
     * Performs an aggregation operation on the model, which filters, sorts and
     * paginates in the same way as the simple read but also joins all one-to-many
     * and many-to-many relations that are configured via a $lookup
     * 
     * @param req R extends AppBaseRequest
     * @returns Promise<T[]>
     */
    private _readAggregation<R extends AppBaseRequest>(req: R): Promise<T[]> {
        const find = this.getFind(req.query);
        const sort = this.getSort(req.query.sort);
        const { skip, limit } = this.getPagination(req.query.page);
        const lookup = this.getLookup();

        let pipeline = [];

        if(find) {
            pipeline.push({
                $match: find
            });
        }

        if(sort) {
            
            pipeline.push({
                $sort: sort
            });
        }
        
        if(skip) {
            pipeline.push({
                $skip: skip
            });
        }

        if(limit) {
            pipeline.push({
                $limit: limit
            });
        }

        if(lookup) {
            pipeline.push(...lookup);
        }

        let col = this.collection.aggregate(pipeline).toArray();
        return col;
    }

    /**
     * @method _validateRelations
     * 
     * A validation method that check within the database if the provided relation
     * ids (on the request body) for this model are correct, based on the relation
     * configuration 
     * 
     * @param entity B extends AppBaseBody
     * @returns { [key:string] : mongodb.ObjectId | mongodb.ObjectId[] } with the 
     * valid relations or false if any relation was invalid
     */
    private async _validateRelations<B extends AppBaseBody>(entity: B): 
        Promise<boolean | 
        { [key:string] : mongodb.ObjectId | mongodb.ObjectId[] } > {

        let validated: { [key:string] : mongodb.ObjectId | mongodb.ObjectId[] } = {};

        for(const key in this.relations) {
            const rel = this.relations[key];

            //If the entity[rel.localField] is empty and the middleware hasn't given an error
            //this field is probably not required. We will leave to the database to decide
            if(Object.keys(rel).length && entity[rel.localField]) {
                
                //If no foreignField is specified for the relation we assume _id
                const foreignField = rel.foreignField ? rel.foreignField : '_id';
                if(rel.isArray) {
                    //We have a one-to-many relation. If entity[rel.localField] is not
                    //an array, we will say it is invalid
                    if(entity[rel.localField] !instanceof Array)
                        return false;
                    
                    const rels = (entity[rel.localField] as Array<string>).map((r) => {
                        return new mongodb.ObjectId(r);
                    });

                    let find: any = {};
                    find[foreignField] = { $in: rels };
                    const check = await mongo.db().collection(rel.from).find(find).toArray();

                    if(check.length < rels.length)
                        return false;

                    validated[rel.localField] = rels;
            
                } else {
                    const objId = new mongodb.ObjectId(entity[rel.localField]);
                    let find: any = {};
                    find[foreignField] = objId;

                    const relation = await mongo.db().collection(rel.from).findOne(find);

                    if(!relation) {
                        return false;
                    }

                    validated[rel.localField] = objId;
                }         
            } 
        }

        return validated;
    }
        
}