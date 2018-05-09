import { AppBaseQuerySchema, SchemaHelpers, AppBaseBodySchema } from './../base/validation';
import * as Joi from 'joi';

export class UserGetQuerySchema extends AppBaseQuerySchema {
    sort = Joi.string().valid('age', '-age');
    country = Joi.string().min(2).max(2);
    age = Joi.object().keys(SchemaHelpers.range)
}

export class UserPostBodySchema extends AppBaseBodySchema {
    username = Joi.string().required().min(2);
    password = Joi.string().required();
    age = Joi.number().required();
    country = Joi.string().min(2).max(2).required();
    group = Joi.string().required();
    allowedServices = Joi.object().keys({
        method: Joi.string().required(),
        path: Joi.string().required()
    })
    allowedRoutes = Joi.array().items(Joi.string().required())
}

export const userGetQuerySchema = new UserGetQuerySchema();
export const userPostBodySchema = new UserPostBodySchema();