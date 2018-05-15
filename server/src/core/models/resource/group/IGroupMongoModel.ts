import { AppServicePath } from './../../AppServicePath';
import { ObjectId } from 'bson';

export interface IGroupMongoModel extends Document {
    _id: ObjectId
    name: string;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}