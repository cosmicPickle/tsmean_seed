import { AppMiddlewareFunction } from './../../../core/middlewares/AppMiddleware';
import { Request, Response, NextFunction } from 'express';
import { appRouteValidationError } from './../../../configuration/errors/errorsConfig';
import { groupRouteGetValidator, groupRoutePostValidator, GroupRouteGetValidator } from './../../../models/routing/request/GroupRouteRequestValidator';
import * as Joi from 'joi';

export class GroupRouteValidatorMiddleware {
    private getValidator: GroupRouteGetValidator = groupRouteGetValidator;
    get: AppMiddlewareFunction = async (req: Request, res: Response, next: NextFunction) => { 
       try {
            await this.getValidator.validateQuery(req.query);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get());
        }
    }
}

export let groupRouteValidatorMiddleware = new GroupRouteValidatorMiddleware();