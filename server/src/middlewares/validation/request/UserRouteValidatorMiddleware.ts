import {AppBaseRequestValidator, AppBaseQuerySchema, AppBaseBodySchema, appBaseBodySchema} from './../../../core/middlewares/validation/request/AppBaseRequestValidator';
import { AppMiddlewareFunction } from './../../../core/middlewares/AppMiddleware';
import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { appRouteValidationError } from './../../../configuration/errors/errorsConfig';

export class UserRouteGetQuerySchema extends AppBaseQuerySchema {
    __sortSchema = Joi.string().valid('age', 'level');
    __filtersSchema = {
        country: Joi.string().min(3).max(32)
    }
}
export let userRouteGetQuerySchema = new UserRouteGetQuerySchema();
export type UserRouteGetValidtor = AppBaseRequestValidator<UserRouteGetQuerySchema, AppBaseBodySchema>;
export let userRouteGetValidtor: UserRouteGetValidtor = new AppBaseRequestValidator<UserRouteGetQuerySchema, AppBaseBodySchema>(
    userRouteGetQuerySchema, 
    appBaseBodySchema
);

export class UserRouteValidatorMiddleware {
    private getValidator: UserRouteGetValidtor = userRouteGetValidtor;
    get: AppMiddlewareFunction = async (req: Request, res: Response, next: NextFunction) => { 
        try {
            await this.getValidator.validateQuery(req.query);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get());
        }
    }
}

export let userRouteValidatorMiddleware = new UserRouteValidatorMiddleware();