import { Document, Model, Schema } from "mongoose";
import { BaseDocument } from "../../../core/models/db/mongo/BaseDocument";
import { userUsernameValidator } from './validators/UserUsernameValidator';
import { IGroup, Group } from './GroupDocument';
import { AppServicePath } from './../../../core/models/AppServicePath';

export interface IUser extends Document {
    username: string;
    password: string;
    group: IGroup;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}

class UserDocument extends BaseDocument<IUser> {
    name = 'User';
    schema = {
        username: {
            type: String,
            required: true,
            unique: true,
            validate: userUsernameValidator.use()
        },
        password: {
            type: String,
            required: true
        },
        group: {
            type: Schema.Types.ObjectId, 
            ref: 'Group',
            required: true,
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
    methods = {}
}

export const User = ((new UserDocument()).model());

export default User;