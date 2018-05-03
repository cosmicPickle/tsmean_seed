
import {AppBaseRequestValidator, AppBaseQuerySchema, AppBaseBodySchema} from './../../../core/models/routing/request/AppBaseRequestValidator';
import { AppMiddlewareFunction } from './../../../core/middlewares/AppMiddleware';
import * as Joi from 'joi';

export class UserRouteGetQuerySchema extends AppBaseQuerySchema {
    sort = Joi.string().valid('age', 'level');
    filters = {
        country: Joi.string().min(2).max(2)
    }
}

export type UserRouteGetValidator = AppBaseRequestValidator<UserRouteGetQuerySchema, AppBaseBodySchema>;
export let userRouteGetValidator = new AppBaseRequestValidator<UserRouteGetQuerySchema, AppBaseBodySchema>(
    new UserRouteGetQuerySchema(), 
    new AppBaseBodySchema()
);