import { Document, Model, Schema } from "mongoose";
import { BaseDocument } from "../../../core/models/db/mongo/BaseDocument";
import { userUsernameValidator } from './validators/UserUsernameValidator';
import { IGroup, Group } from './GroupDocument';

export interface IUser extends Document {
    username: string;
    password: string;
    group: IGroup;
    permissions: number;
    test(): number;
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
        permissions: {
            type: Number
        }
    }
    methods = {
        test: () => {
            return 1;
        }
    }
}

export const User = ((new UserDocument()).model());

export default User;