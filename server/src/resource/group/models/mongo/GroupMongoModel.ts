import { BaseMongoModel } from './../../../../core/models/resource/base/BaseMongoModel';
import { IGroupMongoModel } from './IGroupMongoModel';
import * as mongodb from 'mongodb';

export class GroupMongoModel extends BaseMongoModel<IGroupMongoModel> {
    name = 'groups';
    lookupField: "name" = "name";
    filters = ['name'];
    enableSoftDelete = true;
    projections = {
        default: {
            _id: false,
            name: true
        },
        extended: {
            _id: false,
            name: true,
            allowedRoutes: true,
            allowedServices: true,
        }
    }
}

export let groupMongoModel = new GroupMongoModel();
export let Group = groupMongoModel.get();