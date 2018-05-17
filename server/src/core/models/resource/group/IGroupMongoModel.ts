import { AppServicePath } from './../../AppServicePath';
import { IBaseMongoModel } from '../base/IBaseMongoModel';

export interface IGroupMongoModel extends IBaseMongoModel {
    name: string;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}