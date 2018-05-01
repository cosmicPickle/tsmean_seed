import {AppBaseBody, AppBaseQuery, AppBaseRequest} from './../../../core/models/routing/request/AppBaseRequest'
import { AppServicePath } from '../../../core/models/AppServicePath';

export interface GroupRouteQuery extends AppBaseQuery {

}

export interface GroupRouteBody extends AppBaseBody {
    name: string,
    allowedRoutes: string[],
    allowedServices: AppServicePath[]
}

export interface GroupRouteRequest extends AppBaseRequest<GroupRouteQuery, GroupRouteBody> {

}