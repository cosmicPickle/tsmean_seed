import {AppBaseBody, AppBaseQuery, AppBaseRequest} from './../../../core/models/routing/request/AppBaseRequest'

export interface UserRouteQuery extends AppBaseQuery {
    sort: 'age'|'level'
    country: string
}

export interface UserRouteBody extends AppBaseBody {

}

export interface UserRouteRequest extends AppBaseRequest<UserRouteQuery, UserRouteBody> {

}