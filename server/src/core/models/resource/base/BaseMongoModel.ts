import { mongo } from './../../../lib/AppMongoDriver';
import * as mongodb from 'mongodb';
import { AppBaseRequest, AppBaseQuery, AppBaseBody } from './BaseValidationSchemaTypes';
import * as types from './BaseMongoTypes';

export class BaseMongoModel<T> {
    name: string;
    protected collection: mongodb.Collection<T>;
    protected config: types.BaseMongoModelConfig = {
        resultsPerPage: 10
    };

    get(): mongodb.Collection<T> {
        if(this.collection)
            return this.collection;

        
        if(!this.name) {
            throw new Error(`Can't make collection '${this.constructor.prototype}': 'name' not set`);
        }

        this.collection = mongo.db().collection(this.name);
        return this.collection;
    }

    read<R extends AppBaseRequest>(req: R): Promise<T[]> {
        if(!this.collection) {
            throw new Error(`Collection is not set.`);
        }

        if(this.config.relations && this.config.relations.length) 
            return this._readAggregation(req);

        return this._readSimple(req);
    }

    getFind<P extends AppBaseQuery | AppBaseBody>(input: P)  {

        if(!this.config.filters || !this.config.filters.length) 
            return null;
        
        const filters = this.config.filters;
        let find:any = {};
        filters.forEach((f) => {
            if(!input[f])
                return;
            
            find[f] = this._parseFilter(input[f]);
        });

        return Object.keys(find).length ? find : null;
    }

    getSort<R extends AppBaseRequest>(req: R): types.BaseMongoSort {
        const sortQuery = req.query.sort;

        if(!sortQuery)
            return null;
        
        let sort: types.BaseMongoSort = {};
        const reverse = /^\-/.test(sortQuery);
        sort[!reverse ? sortQuery : sortQuery.substr(1)] = reverse ? -1 : 1;

        return sort;
    }

    getPagination<R extends AppBaseRequest>(req: R): types.BaseMongoPagination {
        if(!this.config.resultsPerPage)
            return null;

        const page = req.query.page >= 1 ? req.query.page : 1;
        const skip = (page - 1) * this.config.resultsPerPage;

        const limit = this.config.resultsPerPage;
        return { skip, limit };
    }

    getLookup(): types.BaseMongoLookup {
        let lookupArr = [];
        
        if(!this.config.relations)
            return lookupArr;

        this.config.relations.forEach((rel) => {
            const _as = rel.as ? rel.as : rel.localField;
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

    _parseFilter<P extends AppBaseQuery | AppBaseBody>(filter: P) {
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

    private _readSimple<R extends AppBaseRequest>(req: R): Promise<T[]> {
        const find = this.getFind(req.query);
        const sort = this.getSort(req);
        const { skip, limit } = this.getPagination(req);

        let cursor = this.collection.find(find ? find: null);
        
        if(sort !== null)
            cursor = cursor.sort(sort);
        
        if(skip !== null)
            cursor = cursor.skip(skip);
        
        if(limit !== null)
            cursor = cursor.limit(limit);

        return cursor.toArray();
    }

    private async _readAggregation<R extends AppBaseRequest>(req: R): Promise<T[]> {
        const find = this.getFind(req.query);
        const sort = this.getSort(req);
        const { skip, limit } = this.getPagination(req);
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
        
}