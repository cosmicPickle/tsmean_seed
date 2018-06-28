import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AppMiddlewareFunction, AppMiddleware } from './../../../core/middlewares/AppMiddleware';
import { groupGetQuerySchema, groupPostBodySchema, groupPutBodySchema } from './../models/validation';
import { appRouteValidationError } from './../../../configuration/errors/errorsConfig';
import { appBaseBodySchema } from '../../../core/models/resource/base/BaseValidationSchema';
import { logger } from '../../../core/lib/AppLogger';

export let groupRouteValidatorMiddleware: AppMiddleware = {
    get: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.query = await groupGetQuerySchema.validate(req.query);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get());
        }
    }],
    post: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.body = await groupPostBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }],
    put: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.body = await groupPutBodySchema.validate(req.body);
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
