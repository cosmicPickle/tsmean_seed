import * as base from './../../../../core/models/resource/base/BaseValidationSchemaTypes'
import { AppServicePath } from './../../../../core/models/AppServicePath';
 
 /**
 *  Request query string types
 */
export interface AuthQuery extends base.AppBaseQuery {
    sort: 'user'|'-user'
    user: string
}

/**
 * Request body types
 */
export interface AuthBody extends base.AppBaseBody {
    user: string;
    password: string;
}
/**
 * Request types
 */
export interface AuthGetRequest extends base.AppBaseRequest<AuthQuery> {};
export type AuthPostRequest = base.AppBaseRequest<base.AppBaseQuery, AuthBody>