import { BaseMongoModel } from './../../../../core/models/resource/base/BaseMongoModel';
import { BaseMongoModelConfig } from './../../../../core/models/resource/base/BaseMongoTypes';
import { IUserMongoModel } from './IUserMongoModel';
import * as mongodb from 'mongodb';

import * as md5 from 'md5';
import config from '../../../../configuration/general';

export class UserMongoModel extends BaseMongoModel<IUserMongoModel> {
    name = 'users';
    resultsPerPage = 5;
    filters = ['country', 'age'];
    enableSoftDelete = false;
    relations = [{
        from: 'groups',
        localField: 'group'
    }];

    onPreSave(entity: IUserMongoModel) {
        entity.password = md5(entity.password + config.pswdSalt);
        return true;
    }
}

export let userMongoModel = new UserMongoModel();
export let User = userMongoModel.get();