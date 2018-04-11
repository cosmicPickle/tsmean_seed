import { Document, Model } from "mongoose";
import { BaseModel } from "../../../core/db/mongo/BaseModel";
import { userUsernameValidator } from './validators/UserUsernameValidator';
export interface IUser extends Document {
    username: string;
    password: string;
    permissions: number;
    session: string;
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
        permissions: {
            type: Number
        }
    }
    _methods = {
        hasPermission: function(threshold: string): boolean {
            return this.permissions <= threshold;
        }
    }

}

export const User = ((new UserModel()).model());
export default User;