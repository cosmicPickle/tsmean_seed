import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AppMiddlewareFunction } from './../../AppMiddleware';
import { userGetQuerySchema, userPostBodySchema, userPutBodySchema } from './../../../models/resource/user/UserValidationSchema';
import { appRouteValidationError } from './../../../../configuration/errors/errorsConfig';
import { appBaseBodySchema } from '../../../models/resource/base/BaseValidationSchema';

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
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }

    put: AppMiddlewareFunction = async (req: Request, res: Response, next: NextFunction) => { 
        try {
            await userPutBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }

    delete: AppMiddlewareFunction = async (req: Request, res: Response, next: NextFunction) => { 
        try {
            await appBaseBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }
}

export let userRouteValidatorMiddleware = new UserRouteValidatorMiddleware();