import { BaseMongoModel } from './../base/BaseMongoModel';
import { IUserMongoModel } from './IUserMongoModel';
import * as mongodb from 'mongodb';
import { BaseMongoModelConfig } from '../base/BaseMongoTypes';
import * as md5 from 'md5';
import config from '../../../../configuration/general';

export class UserMongoModel extends BaseMongoModel<IUserMongoModel> {
    name = 'users';
    resultsPerPage = 5;
    filters = ['country'];
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