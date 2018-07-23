import { mongo } from './../../../lib/AppMongoDriver';
import * as mongodb from 'mongodb';
import { AppBaseRequest, AppBaseQuery, AppBaseBody } from './BaseValidationSchemaTypes';
import * as types from './BaseMongoTypes';
import { IBaseMongoModel } from './IBaseMongoModel';
import { logger } from '../../../lib/AppLogger';
import { Q } from '../../../lib/Q';
import { debug } from 'util';

export class BaseMongoModel<T extends IBaseMongoModel> implements types.BaseMongoModelConfig<T> {
    name: string;
    /**
     * @property keyof T
     * 
     * The lookup field will be used as a default document location field in each CRUD operation.
     * 
     * @default '_id'
     */
    lookupField: keyof T = '_id';
    /**
     * @property Object properties of type types.BaseMongoProjection<T>
     * 
     * These profiles are used as $presets to generate $project operators
     * for aggregate and find.
     * 
     * The 'default' profile is required and is used when reading many entries
     * The 'extended' profile is used when reading a single entry
     * 
     * More profiles can be defined if other projections are desired. See docs
     * for read and readOne.
     */
    projections: {
        default: types.BaseMongoProjection<T>,
        [key: string] : types.BaseMongoProjection<T>
    };
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
    relations: {
        [P in keyof T]?: types.BaseMongoRelation<any>
    }
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
     * a __deleted property will be added at the document root level
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
     * @param string = 'default' shows which projection profile should be used for projection
     * @param {[P in keyof T] : string} Optional. If the model has any relations, 
     * specifies which projection profile should be used for each relation respectively.
     * If not set the profile of the main model is taken.
     * @returns Promise<T[]>
     * @throws Error if this.collection is undefined
     * @throws MongoError if there was a problem with the read
     */
    read<R extends AppBaseRequest>(
        req: R, 
        projection: string = 'default', 
        relationProjections?: {[P in keyof T]? : string}
    ): Promise<T[]> {
        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        if(this.relations && Object.keys(this.relations).length) 
            return this._readAggregation(req, projection, relationProjections);

        return this._readSimple(req, projection);
    }

    /**
     * @function readOne
     * 
     * Reads a single entry from a collection based on an id. The default search field is id_. If a second parameter
     * is provided it will find by that field as well
     * 
     * @param id the id to find
     * @param by the field in which the id is searched
     * @param string = 'default' shows which projection profile should be used for projection
     * @param {[P in keyof T] : string} Optional. If the model has any relations, 
     * specifies which projection profile should be used for each relation respectively.
     * If not set the profile of the main model is taken.
     * @returns Promise<T>
     * @throws Error if this.collection is undefined
     * @throws MongoError if there was a problem with the read
     */
    readOne(
        id: string | number | mongodb.ObjectId, 
        by: keyof T = this.lookupField, 
        projection: string = 'default', 
        relationProjections?: {[P in keyof T]? : string}
    ): Promise<T> {
        if(!by) {
            by = this.lookupField
        }

        id = this._parseObjectId(id);

        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        if(this.relations && Object.keys(this.relations).length) 
            return this._readOneAggregation(id, by, projection, relationProjections);

        return this._readOneSimple(id, by, projection);
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
    async create<B extends AppBaseBody>(entity: B): Promise<types.InsertOneWriteOpResult<T>> {
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
     * @throws Error if the entity is empty
     * @throws Error if any of the relation ids provided is invalid
     * @throws Error if pre-save hook fails
     * @throws MongoError if there was a problem with the update or relation validation
     */
    async update<B extends AppBaseBody>(
        id: string | number | mongodb.ObjectId, 
        entity: B,
        by: keyof T = this.lookupField): Promise<mongodb.UpdateWriteOpResult>{
        
        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        id = this._parseObjectId(id);

        if(this.relations && this.checkRelationsValidity) {     
            const validated = await this._validateRelations(entity);

            if(validated === false)
                throw new Error(`Invalid relation.`);

            entity = Object.assign({}, entity, validated);
        }
  
        if(Object.keys(entity).length == 0)
            throw new Error(`Empty update.`);

        if((this as any).onPreSave)
            if((this as any).onPreSave(entity) === false)
                throw new Error(`Pre-save operation failed`);

        let query: any = {};

        query[by] = id;

        //Let's not forget to add the soft delete
        if(this.enableSoftDelete)
            query.$or = [{
                __deleted: false
            }, {
                __deleted: {
                    $exists: false
                }
            }]

        return this.collection.updateOne(query, {
            $set: entity
        });
    }

    /**
     * @function delete
     * 
     * Deletes a document by id or a unique field. If soft delete is enabled
     * adds a __deleted:true property on the document
     * 
     * @param id string | number | mongodb.ObjectId
     * @param by keyof T @default this.lookupField
     * @returns Promise<mongodb.UpdateWriteOpResult>
     * @throws Error if this.collection is undefined
     * @throws MongoError if there was a problem with the create or relation validation
     */
    async delete<B extends AppBaseBody>(
        id: string | number | mongodb.ObjectId, 
        by: keyof T = this.lookupField
    ): Promise<mongodb.DeleteWriteOpResultObject> {

        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        id = this._parseObjectId(id);

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
     * @function restore
     * 
     * If the model has enableSofDelete set to true tries to restore a deleted entry
     * 
     * @param id string | number | mongodb.ObjectId
     * @param by keyof T @default this.lookupField
     * @throws Error if enableSoftDelete is false
     * @throws Error if this.collection is undefined
     * @returns Promise<mongodb.UpdateWriteOpResult>
     */
    async restore(
        id: string | number | mongodb.ObjectId, 
        by: keyof T = this.lookupField
    ): Promise<mongodb.UpdateWriteOpResult>{
        if(!this.enableSoftDelete) {
            throw new Error('This model does not support soft delete.');
        }
        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        id = this._parseObjectId(id);

        let query: any = {
            __deleted: true
        }
        query[by] = id;

        return this.collection.updateOne(query, {
            $set: {
                __deleted: false
            }
        });
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

        //Let's not forget to add the soft delete
        if(this.enableSoftDelete)
            find.$or = [{
                __deleted: false
            }, {
                __deleted: {
                    $exists: false
                }
            }]

        return Object.keys(find).length ? find : null;
    }

    /**
     * @function getSort
     * 
     * Takes a sort query string (eg age|-age) and tries to resolve sort field and direction. 
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

        Object.keys(this.relations).forEach((key) => {
            let rel: types.BaseMongoRelation<any> = this.relations[key];
            //If we don't have an 'as' field specified in the relation
            //we are just gonna use the localField
            const _as = rel.as ? rel.as : key;
            //Most often the foreign field will be the document _id
            const foreignField = rel.foreignField ? rel.foreignField : '_id';

            let lookup = {
                $lookup: {
                    from: rel.from,
                    localField: key,
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
     * @function getProjection
     * 
     * Returns an array which can be used in an aggregation query to produce documents with only the desired
     * fields of the model AND all its relations. The selected fields are determined by the projection profiles
     * selected with the two parameters.
     * 
     * @param projection string = 'default' shows which projection profile should be used for projection
     * @param relationProjections {[P in keyof T] : string} Optional. If the model has any relations, 
     * specifies which projection profile should be used for each relation respectively.
     */
    getProjection(
        projection: string = 'default', 
        relationProjections?: {[P in keyof T]? : string}
    ) : any[] {
        
        //The selected projection profile
        let $project = this.projections[projection];
        
        if(!$project) 
            return [];


        //We will store the response here
        let projectionArr = [];
        //We push the projection of the model
        projectionArr.push({$project : $project});

        for(let key in this.relations) {
            //The current relation and the key by which the related data will be stored in the final
            //document. NOTE: If the relation "as" field is provided the projection profile needs to 
            //include that field in order for the relation data to show
            const rel: types.BaseMongoRelation<any> = this.relations[key];
            const _as = rel.as ? rel.as : key;

            //If we aren't projecting the field of the relation there is nothing to do here
            if(!$project[_as] || !this.relations.hasOwnProperty(key))
                continue;
            
            //The projection profile of the relation
            const $relProj = relationProjections && relationProjections[key]
                                ? rel.projections[relationProjections[key]] 
                                : rel.projections[projection];

            //The final projection that is going to be pushed in the projectionArr
            let $finalProj: types.BaseMongoProjection<T> = {};

            if(!$relProj) {
                //If the relation projection profile is undefined, we will disallow the projection of the 
                //current projection field and log a warning
                $finalProj[_as] = false;
                logger.warn(`No '${relationProjections && relationProjections[key] ? relationProjections[key] : projection}' projection ` 
                            + `is provided for relation '${key}' of model '${this.constructor.name}'`);
                projectionArr.push({ $project: $finalProj});
                continue;
            }

            if(!rel.isArray) {
                //This is a one-to-one relationship. We just need to select which fields of the relation to 
                //project 
                $finalProj = $project;
                $finalProj[_as] = Object.assign($relProj);
                
                if($finalProj[_as]._id === false) {
                    //We need to specifically handle the case when the _id projection is set to false
                    //because mongo gets touchy about disabling _id in a child document
                    delete $finalProj[_as]._id;
                    projectionArr.push({ $project: $finalProj });

                    let $tmp: types.BaseMongoProjection<T> = {};
                    $tmp[_as] = { _id: false };

                    projectionArr.push({ $project: $tmp });
                } else {
                    projectionArr.push({ $project: $finalProj });
                }       
            } else {
                /**
                 * In case of one-to-many rel we must do the following operations:
                 * - $unwind the array of related documents
                 * - $project the appropriate fields of the new documents, flattening the object
                 * - $group by the original top level properties
                 * - $project the appropriate end projection to get rid of the 
                 * _id created by $group
                 */
                //We create a deep copy of $project to modify
                let $currentProject: types.BaseMongoProjection<T> = JSON.parse(JSON.stringify($project));
                //_as is the key where the relation will be projected. We don't need it in this projection,
                //as it will be substituted with key.relProjectKey pairs
                delete $currentProject[_as];

                //Used as aggregator operator in the $group stage
                let $push: any = {}; 
                //Used as _id in the group stage
                let $groupIds: any = {};
                

                projectionArr.push({ $unwind: `\$${_as}` });

                for(let relProjKey in $relProj) {
                    if(!relProjKey || !$relProj.hasOwnProperty(relProjKey))
                        continue;

                    //Preparing the fields to bring the object to top level
                    $currentProject[`${_as}.${relProjKey}`] = `\$${_as}.${relProjKey}`;
                    //We can also prepare the fields we are going to push into the $group stage later
                    $push[relProjKey] = `\$${_as}.${relProjKey}`
                }

                //Flattening the object
                projectionArr.push({ $project: $currentProject });

                for(let pjKey in $project) {
                    if(pjKey == _as && !$project.hasOwnProperty(pjKey))
                        continue;
                    //We need to get all $project keys except the one of the child document
                    if(pjKey != _as)  
                    {
                        //We generate those into groupIds by which we are gonna group the documents
                        $groupIds[pjKey] = `\$${pjKey}`;
                        //We also generate the final projection which will take the original fields
                        //out of the _id field generated by the $group stage
                        $finalProj[pjKey] = `\$_id.${pjKey}`;
                    }  
                }
                let $group =  {
                    _id : $groupIds
                }
                $group[_as] = {
                    $push: $push
                }
                projectionArr.push({ $group: $group });


                $finalProj[key] = true;
                $finalProj._id = false;
                projectionArr.push({ $project: $finalProj });
            }
        }
        return projectionArr;
    }

    private _parseObjectId(id: string | number | mongodb.ObjectId ) : string | number | mongodb.ObjectId {

        if(!mongodb.ObjectID.isValid(id)) {
            return id;
        }

        let testObjectId: mongodb.ObjectId = new mongodb.ObjectID(id);
        return testObjectId == id ? testObjectId : id;
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
        let parsed: any = {};
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
     * @param projection string = 'default' shows which projection profile should be used for projection
     * @returns Promise<T[]>
     */
    private _readSimple<R extends AppBaseRequest>(
        req: R, 
        projection: string = 'default'
    ): Promise<T[]> {

        const find = this.getFind(req.query);
        const sort = this.getSort(req.query.sort);
        const { skip, limit } = this.getPagination(req.query.page);
        const $project = this.projections[projection] || {};
        
        let cursor = this.collection.find(find ? find: null);
        
        if(Object.keys($project).length > 0)
            cursor.project($project);
        else {
            logger.warn(`No '${projection}' projection is defined on model: ${this.constructor.name}`);
            return new Q().defer().resolve([]);
        }
        
        if(sort !== null)
            cursor = cursor.sort(sort);
        
        if(skip !== null)
            cursor = cursor.skip(skip);
        
        if(limit !== null)
            cursor = cursor.limit(limit);

        return cursor.toArray();
    }

    /**
     * @function _readOneSimple
     * 
     * Performs a simple readOne operation on a model.
     * 
     * @param id the id whis is searched
     * @param by the field in which the id is searched (default _id)
     * @param projection string = 'default' shows which projection profile should be used for projection
     */
    private _readOneSimple(
        id: string | number | mongodb.ObjectId, 
        by: keyof T = this.lookupField,
        projection: string = 'default'
    ): Promise<T> {

        let find: any = {};
        find[by] = id;

        //Let's not forget to add the soft delete
        if(this.enableSoftDelete)
            find.$or = [{
                __deleted: false
            }, {
                __deleted: {
                    $exists: false
                }
            }]

        const $project = this.projections[projection];

        let cursor = this.collection.find(find);
        if($project){
            cursor.project($project);
        }
        return cursor.next();
    }

    /**
     * @method _readAggregation
     * 
     * Performs an aggregation operation on the model, which filters, sorts and
     * paginates in the same way as the simple read but also joins all one-to-many
     * and many-to-many relations that are configured via a $lookup
     * 
     * @param req R extends AppBaseRequest
     * @param projection string = 'default' shows which projection profile should be used for projection
     * @param relationProjections {[P in keyof T] : string} Optional. If the model has any relations, 
     * specifies which projection profile should be used for each relation respectively.
     * @returns Promise<T[]>
     */
    private _readAggregation<R extends AppBaseRequest>(
        req: R, 
        projection: string = 'default', 
        relationProjections?: {[P in keyof T]? : string}
    ): Promise<T[]> {

        const find = this.getFind(req.query);
        const sort = this.getSort(req.query.sort);
        const { skip, limit } = this.getPagination(req.query.page);
        const lookup = this.getLookup();
        const $projection = this.getProjection(projection, relationProjections);
        
        if(!$projection.length) {
            logger.warn(`No '${projection}' projection is defined on model: ${this.constructor.name}`);
            return new Q().defer().resolve([]);
        }
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

        if($projection) {
            pipeline.push(...$projection);
        }

        let col = this.collection.aggregate(pipeline).toArray();
        return col;
    }

    /**
     * @function _readOneAggregation
     * 
     * Reads one entry with a specified id and aggregates all its 
     * one-to-one and one-to-many relations
     * 
     * @param id the id whis is searched
     * @param by the field in which the id is searched (default _id)
     * @param projection string = 'default' shows which projection profile should be used for projection
     * @param relationProjections {[P in keyof T] : string} Optional. If the model has any relations, 
     * specifies which projection profile should be used for each relation respectively.
     */
    private _readOneAggregation(
        id: string | number | mongodb.ObjectId, 
        by: keyof T = this.lookupField, 
        projection: string = 'default', 
        relationProjections?: {[P in keyof T]? : string}
    ): Promise<T> {
        let find: any = {};
        find[by] = id;

        //Let's not forget to add the soft delete
        if(this.enableSoftDelete)
            find.$or = [{
                __deleted: false
            }, {
                __deleted: {
                    $exists: false
                }
            }]

        let $project = this.getProjection(projection, relationProjections);

        if(!$project.length) {
            logger.warn(`No '${projection}' projection is defined on model: ${this.constructor.name}`);
            return new Q().defer().resolve({});
        }
        return this.collection.aggregate([{
                $match: find
            }, ...this.getLookup(), ...$project]).next();
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

            //If the entity[key] is empty and the middleware hasn't given an error
            //this field is probably not required. We will leave to the database to decide
            if(Object.keys(rel).length && entity[key as string]) {
                
                //If no foreignField is specified for the relation we assume _id
                const foreignField = rel.foreignField ? rel.foreignField : '_id';
                if(rel.isArray) {
                    //We have a one-to-many relation. If entity[key] is not
                    //an array, we will say it is invalid
                    if(entity[key as string] !instanceof Array)
                        return false;
                    
                    const rels = (entity[key as string] as Array<string>).map((r) => {
                        return new mongodb.ObjectId(r);
                    });

                    let find: any = {};
                    find[foreignField] = { $in: rels };
                    const check = await mongo.db().collection(rel.from).find(find).toArray();

                    if(check.length < rels.length)
                        return false;

                    validated[key as string] = rels;
            
                } else {
                    const objId = new mongodb.ObjectId(entity[key as string]);
                    let find: any = {};
                    find[foreignField] = objId;

                    const relation = await mongo.db().collection(rel.from).findOne(find);

                    if(!relation) {
                        return false;
                    }

                    validated[key as string] = objId;
                }         
            } 
        }

        return validated;
    }
        
}