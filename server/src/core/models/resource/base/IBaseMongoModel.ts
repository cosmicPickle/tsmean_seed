import { ObjectId } from 'bson';

export interface IBaseMongoModel {
    _id: ObjectId
}