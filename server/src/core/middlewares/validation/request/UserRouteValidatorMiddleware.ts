import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AppMiddlewareFunction } from './../../AppMiddleware';
import { userGetQuerySchema, userPostBodySchema } from './../../../models/resource/user/UserValidationSchema';
import { appRouteValidationError } from './../../../../configuration/errors/errorsConfig';

export class UserRouteValidatorMiddleware {
    get: AppMiddlewareFunction = async (req: Request, res: Response, next: NextFunction) => { 
        try {
            await userGetQuerySchema.validate(req.query);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get());
        }
    }
    post: AppMiddlewareFunction = async (req: Request, res: Response, next: NextFunction) => { 
        try {
            await userPostBodySchema.validate(req.body);
            next();
        } catch(e) {
            console.log(e)
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }
}

export let userRouteValidatorMiddleware = new UserRouteValidatorMiddleware();