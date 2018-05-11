import { BaseMongoModel } from './../base/BaseMongoModel';
import { IUserMongoModel } from './IUserMongoModel';
export class UserMongoModel extends BaseMongoModel<IUserMongoModel> {
    name = 'users';
}

export let User = new UserMongoModel().get();