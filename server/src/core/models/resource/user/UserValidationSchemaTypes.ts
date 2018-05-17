 import * as base from './../base/BaseValidationSchemaTypes'
import { AppServicePath } from '../../AppServicePath';
 
 /**
 *  Request query string types
 */
export interface UserQuery extends base.AppBaseQuery {
    sort: '+age'|'-age'
    country: string,
    age: base.SchemaHelpers.Range
}

/**
 * Request body types
 */
export interface UserBody extends base.AppBaseBody {
    username: string;
    password: string;
    age: number;
    country: string;
    group: string;
    allowedServices: AppServicePath[];
    allowedRoutes: string[];
}
/**
 * Request types
 */
export interface UserGetRequest extends base.AppBaseRequest<UserQuery> {};
export type UserPostRequest = base.AppBaseRequest<base.AppBaseQuery, UserBody>