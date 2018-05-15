import { BaseMongoModel } from './../base/BaseMongoModel';
import { IUserMongoModel } from './IUserMongoModel';
import * as mongodb from 'mongodb';
import { BaseMongoModelConfig } from '../base/BaseMongoTypes';

export class UserMongoModel extends BaseMongoModel<IUserMongoModel> {
    name = 'users';

    protected config: BaseMongoModelConfig = {
        resultsPerPage: 5,
        filters: ['country'],
        relations: [{
            from: 'groups',
            localField: 'group'
        }]
    }
}

export let userMongoModel = new UserMongoModel();
export let User = userMongoModel.get();