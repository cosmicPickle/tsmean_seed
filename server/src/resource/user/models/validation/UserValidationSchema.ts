import { AppBaseQuerySchema, SchemaHelpers, AppBaseBodySchema } from './../../../../core/models/resource/base/BaseValidationSchema';
import * as Joi from 'joi';

export class UserGetQuerySchema extends AppBaseQuerySchema {
    sort = Joi.string().valid('age', '-age');
    country = Joi.string().min(2).max(2);
    age = Joi.object().keys(SchemaHelpers.range)
}

export class UserPutBodySchema extends AppBaseBodySchema {
    username = Joi.string().forbidden();
    password = Joi.string();
    age = Joi.number();
    country = Joi.string().min(2).max(2);
    group = Joi.string();
    allowedServices = Joi.array().items(Joi.object().optional().keys({
        method: Joi.string().required(),
        path: Joi.string().required()
    }));
    allowedRoutes = Joi.array().items(Joi.string()).optional();
}
export class UserPostBodySchema extends UserPutBodySchema {

    constructor() {
        super();
        this.username = this.username.required();
        this.password = this.password.required();
        this.age = this.age.required();
        this.country = this.country.required();
        this.group = this.group.required();
    }
    
}

export const userGetQuerySchema = new UserGetQuerySchema();
export const userPostBodySchema = new UserPostBodySchema();
export const userPutBodySchema = new UserPutBodySchema();