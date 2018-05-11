import { mongo } from './../../../lib/AppMongoDriver';
import { Collection, Db } from 'mongodb';

export class BaseMongoModel<T> {
    name: string;
    collection: Collection<T>;

    constructor() { 
        
    }
    get(): Collection<T> {
        if(this.collection)
            return this.collection;

        
        if(!this.name) {
            throw new Error(`Can't make collection '${this.constructor.prototype}': 'name' not set`);
        }

        this.collection = mongo.db().collection(this.name);
        return this.collection;
    }
        
}