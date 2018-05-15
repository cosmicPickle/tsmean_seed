import { BaseMongoModel } from './../base/BaseMongoModel';
import { IGroupMongoModel } from './IGroupMongoModel';
import * as mongodb from 'mongodb';

export class GroupMongoModel extends BaseMongoModel<IGroupMongoModel> {
    name = 'groups';
}

export let Group = new GroupMongoModel().get();