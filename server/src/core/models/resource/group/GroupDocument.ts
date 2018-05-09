import { Document, Model } from "mongoose";
import { BaseDocument } from './../base/BaseDocument'
import * as types from './types';
import * as base from '../base/types';
class GroupDocument extends BaseDocument<types.IGroup> {
    name = 'Group';
    schema = {
        name: {
            type: String,
            required: true,
            unique: true
        },
        allowedServices: {
            type: [{
                method: String,
                path: String
            }]
        },
        allowedRoutes: {
            type: [String]
        }
    }
    methods = { }

}

export const Group = ((new GroupDocument()).model());
export default Group;
