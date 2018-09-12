import { BaseMongoModel } from './../../../../core/models/resource/base/BaseMongoModel';
import { BaseMongoModelConfig, BaseMongoRelation } from './../../../../core/models/resource/base/BaseMongoTypes';
import { IAuthMongoModel } from './IAuthMongoModel';
import { IUserMongoModel } from '../../../user';

export class AuthMongoModel extends BaseMongoModel<IAuthMongoModel> {
    name = 'auth';
    lookupField: 'jwt' = 'jwt';
    projections = {
        default: {
            _id: false,
            user: true
        },
        extended: {
            _id: false,
            user: true,
            jwt: true,
        }
    }
    resultsPerPage = 10;
    filters = ['user'];
    enableSoftDelete = false;

    relations = {
        user: new BaseMongoRelation<IUserMongoModel>({
            from: 'users',
            projections: {
                default: { username: true },
                extended: { 
                    _id: false,
                    username: true,
                    allowedRoutes: true,
                    allowedServices: true
                }
            },
        })
    };
}
export let authMongoModel = new AuthMongoModel();
export let Auth = authMongoModel.get();