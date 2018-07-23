import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AppMiddlewareFunction, AppMiddleware } from './../../../core/middlewares/AppMiddleware';
import { authGetQuerySchema, authPostBodySchema } from './../models/validation';
import { appRouteValidationError } from './../../../configuration/errors/errorsConfig';
import { appBaseBodySchema } from '../../../core/models/resource/base/BaseValidationSchema';

export let authRouteValidatorMiddleware: AppMiddleware = {
    post: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.body = await authPostBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
    }],
    get: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.query = await authGetQuerySchema.validate(req.query);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get());
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

