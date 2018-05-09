import { Document } from 'mongoose';
import * as base from './../base/types';
import { IGroup } from './../group/types';
import { AppServicePath } from './../../AppServicePath';

/**
 * Documnent type
 */
export interface IUser extends Document {

    username: string;
    password: string;
    country: string;
    age: number;
    group: IGroup;
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}

/**
 * Mongo runtime method definitions type
 */
export interface IUserModel extends base.mongo.IBaseModel<IUser> {

}

/**
 * Mongo query method definitions type
 */

export interface IUserDocumentQuery extends base.mongo.IBaseDocumentQuery<IUser> {

}

/**
 *  Request query string types
 */
export interface UserQuery extends base.io.AppBaseQuery {
    sort: '+age'|'-age'
    country: string,
    age: base.io.SchemaHelpers.Range
}

/**
 * Request body types
 */
export interface UserBody extends base.io.AppBaseBody {

}

/**
 * Request types
 */
export type UserGetRequest = base.io.AppBaseRequest<UserQuery>;
