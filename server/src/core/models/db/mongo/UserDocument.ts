import { AppBaseRequest } from './../../routing/request/AppBaseRequest';
import { Document, Model, Schema } from "mongoose";
import { BaseDocument, IBaseModel, IBaseDocumentQuery } from "./BaseDocument";
import { userUsernameValidator } from './validators/UserUsernameValidator';
import { IGroup, Group } from './GroupDocument';
import { AppServicePath } from './../../AppServicePath';
import { mongoose } from "./connection";

export interface IUser extends Document {
    username: string;
    password: string;
    country: string;
    group: IGroup;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}

export interface IUserDocumentQuery extends IBaseDocumentQuery<IUser> {
    filter(country: string): this;
}

class UserDocument extends BaseDocument<IUser, IBaseModel<IUser>, IUserDocumentQuery> {
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
        country: {
            type: String,
            required: true
        },
        group: {
            type: mongoose.Schema.Types.ObjectId, 
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
    methods = {};
    statics = {};
    query = {
        filter<T extends AppBaseRequest>(country) {
            return (this as IUserDocumentQuery).find({
                country: country
            })
        }
    }
}

export const User = ((new UserDocument()).model());

export default User;