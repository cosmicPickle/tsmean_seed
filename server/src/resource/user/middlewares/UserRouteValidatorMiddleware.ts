import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AppMiddlewareFunction, AppMiddleware } from './../../../core/middlewares/AppMiddleware';
import { userGetQuerySchema, userPostBodySchema, userPutBodySchema } from './../models/validation';
import { appRouteValidationError } from './../../../configuration/errors/errorsConfig';
import { appBaseBodySchema } from '../../../core/models/resource/base/BaseValidationSchema';

export let userRouteValidatorMiddleware: AppMiddleware = {
    get: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.query = await userGetQuerySchema.validate(req.query);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get());
        }
    }],
    post: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.body = await userPostBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }],
    put: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.body = await userPutBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }],
    
    delete: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.body = await appBaseBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }]
}
