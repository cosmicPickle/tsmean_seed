import { AppServicePath } from '../../../../core/models/AppServicePath';
import { IBaseMongoModel } from '../../../../core/models/resource/base/IBaseMongoModel';
import * as mongodb from 'mongodb';
import { IUserMongoModel } from '../../../user';
export interface IAuthMongoModel extends IBaseMongoModel {
    user: IUserMongoModel;
    jwt: string;
}