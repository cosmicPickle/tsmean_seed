import { AppBaseQuerySchema, SchemaHelpers, AppBaseBodySchema } from './../../../../core/models/resource/base/BaseValidationSchema';
import * as Joi from 'joi';

export class AuthGetQuerySchema extends AppBaseQuerySchema {
    sort = Joi.string().valid('user', '-user');
    user = Joi.string();
}

export class AuthPostBodySchema extends AppBaseBodySchema{

    user = Joi.string().required();
    password = Joi.string().required();
}

export const authGetQuerySchema = new AuthGetQuerySchema();
export const authPostBodySchema = new AuthPostBodySchema();