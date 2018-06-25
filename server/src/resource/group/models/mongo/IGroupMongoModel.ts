import { AppServicePath } from './../../../../core/models/AppServicePath';
import { IBaseMongoModel } from './../../../../core/models/resource/base/IBaseMongoModel';

export interface IGroupMongoModel extends IBaseMongoModel {
    name: string;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}