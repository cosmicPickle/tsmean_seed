import {AppBaseRequestValidator, AppBaseQuerySchema, AppBaseBodySchema} from './../../../core/models/routing/request/AppBaseRequestValidator';
import { AppMiddlewareFunction } from './../../../core/middlewares/AppMiddleware';
import * as Joi from 'joi';

export class GroupRouteGetQuerySchema extends AppBaseQuerySchema {

}

export class GroupRoutePostBodySchema extends AppBaseBodySchema {

}

export type GroupRouteGetValidator = AppBaseRequestValidator<GroupRouteGetQuerySchema, AppBaseBodySchema>;

export type GroupRoutePostValidator = AppBaseRequestValidator<AppBaseQuerySchema, GroupRoutePostBodySchema>;

export let groupRouteGetValidator = new AppBaseRequestValidator<GroupRouteGetQuerySchema, AppBaseBodySchema>(
    new GroupRouteGetQuerySchema(),
    new AppBaseBodySchema()
);

export let groupRoutePostValidator = new AppBaseRequestValidator<AppBaseQuerySchema, GroupRoutePostBodySchema>(
    new AppBaseQuerySchema(),
    new GroupRoutePostBodySchema()
);