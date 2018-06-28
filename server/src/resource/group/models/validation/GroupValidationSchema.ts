import { AppBaseQuerySchema, SchemaHelpers, AppBaseBodySchema } from './../../../../core/models/resource/base/BaseValidationSchema';
import * as Joi from 'joi';

export class GroupGetQuerySchema extends AppBaseQuerySchema {
    sort = Joi.string().valid('name', '-name');
    name = Joi.string().min(4).max(32);
}

export class GroupPostBodySchema extends AppBaseBodySchema {
    name = Joi.string().min(4).max(32).required();
    allowedServices = Joi.array().items(Joi.object().optional().keys({
        method: Joi.string().required(),
        path: Joi.string().required()
    }));
    allowedRoutes = Joi.array().items(Joi.string()).optional();
}

export class GroupPutBodySchema extends GroupPostBodySchema {
    constructor() {
        super();
        this.name = this.name.forbidden();
    }
}

export let groupGetQuerySchema = new GroupGetQuerySchema();
export let groupPostBodySchema = new GroupPostBodySchema();
export let groupPutBodySchema = new GroupPutBodySchema();