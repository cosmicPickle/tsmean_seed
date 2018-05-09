import * as base from './../base/types';
import * as types from './types';

import { BaseDocument } from './../base/BaseDocument';
import { Document, Model, Schema } from "mongoose";
import { UserDocumentSchema } from './UserDocumentSchema';

class UserDocument extends BaseDocument<
    types.IUser, 
    base.mongo.IBaseModel<types.IUser>, 
    types.IUserDocumentQuery
> {
    name = 'User';
    schema = UserDocumentSchema;
    methods = {};
    statics = {};
    query = {
        filter<T extends base.io.AppBaseRequest>(country) {
            return (this as types.IUserDocumentQuery).find({
                country: country
            })
        }
    }
}

export const User = ((new UserDocument()).model());

export default User;