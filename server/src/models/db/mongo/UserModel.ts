import { Document, Model, Schema } from "mongoose";
import { BaseModel } from "../../../core/models/db/mongo/BaseModel";
import { userUsernameValidator } from './validators/UserUsernameValidator';
import { IGroup, Group } from './GroupModel';

export interface IUser extends Document {
    username: string;
    password: string;
    group: IGroup;
    permissions: number;
    hasPermission(threshold: number) : boolean;
}

class UserModel extends BaseModel<IUser> {
    _name = 'User';
    _schema = {
        username: {
            type: String,
            required: true,
            validate: userUsernameValidator.use()
        },
        password: {
            type: String,
            required: true
        },
        group: {
            type: Schema.Types.ObjectId, 
            ref: 'Group' 
        },
        permissions: {
            type: Number
        }
    }
    _methods = {
        hasPermission: function(threshold: number): boolean {
            return this.permissions <= threshold;
        }
    }

}

export const User = ((new UserModel()).model());
export default User;