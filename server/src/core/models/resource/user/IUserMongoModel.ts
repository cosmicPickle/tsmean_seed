import { AppServicePath } from '../../AppServicePath';
import { IGroupMongoModel } from '../group/IGroupMongoModel';
import { IBaseMongoModel } from '../base/IBaseMongoModel';

export interface IUserMongoModel extends IBaseMongoModel {
    username: string;
    password: string;
    age: number;
    country: string;
    group: IGroupMongoModel;
    allowedServices: AppServicePath[];
    allowedRoutes: string[];
}