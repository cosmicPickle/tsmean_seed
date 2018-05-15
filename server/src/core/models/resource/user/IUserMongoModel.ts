import { AppServicePath } from '../../AppServicePath';
import { IGroupMongoModel } from '../group/IGroupMongoModel';
import { ObjectId } from 'bson';
export interface IUserMongoModel {
    _id: ObjectId;
    username: string;
    password: string;
    age: number;
    country: string;
    group: IGroupMongoModel;
    allowedServices: AppServicePath[];
    allowedRoutes: string[];
}