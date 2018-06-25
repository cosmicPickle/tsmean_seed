import { AppServicePath } from '../../../../core/models/AppServicePath';
import { IGroupMongoModel } from '../../../group/models/mongo/IGroupMongoModel';
import { IBaseMongoModel } from '../../../../core/models/resource/base/IBaseMongoModel';

export interface IUserMongoModel extends IBaseMongoModel {
    username: string;
    password: string;
    age: number;
    country: string;
    group: IGroupMongoModel;
    allowedServices: AppServicePath[];
    allowedRoutes: string[];
}