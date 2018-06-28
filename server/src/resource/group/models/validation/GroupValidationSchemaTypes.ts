import * as base from './../../../../core/models/resource/base/BaseValidationSchemaTypes'
import { AppServicePath } from './../../../../core/models/AppServicePath';

export interface GroupQuery {
    name: string,
    sort: '-name'|'name';
}

export interface GroupBody {
    name: string,
    allowedServices: AppServicePath[],
    allowedRoutes: string[]
}

export interface GroupGetRequest extends base.AppBaseRequest<GroupQuery> {};
export type GroupPostRequest = base.AppBaseRequest<base.AppBaseQuery, GroupBody>