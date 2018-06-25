
import * as Joi from 'joi';
import { logger } from '../../../lib/AppLogger';

export namespace SchemaHelpers {
    
    export const lt = {
        lt: Joi.number().integer()
    }

    export const gt = {
        gt: Joi.number().integer()
    }

    export const range = {
        gt: Joi.number().integer(),
        lt: Joi.number().integer().min(Joi.ref('gt'))
    }

    export const $in = {
        in: Joi.array()
    }
}

export class BaseValidationSchema {
    validate<T>(obj: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let _schema = Joi.object();
            let keys: Joi.SchemaMap = {};
            
            Object.keys(this).forEach((k) => {
                return keys[k] = this[k];
            })


            if(!keys) {
                resolve({} as T);
                return;
            }

            try {
                _schema = (_schema as Joi.ObjectSchema).keys(keys);

                const { error, value } = Joi.validate(obj, _schema);

                if(error)
                    throw error;

                resolve(value as T);
            } catch (e) {
                throw e;
            }
        })
    }
}

export class AppBaseQuerySchema extends BaseValidationSchema {
    sort: Joi.StringSchema = Joi.string().regex(/^(\-|[a-zA-Z0-9\_])/);
    page: Joi.NumberSchema = Joi.number().min(0);
}

export class AppBaseBodySchema extends BaseValidationSchema { }

export let appBaseQuerySchema = new AppBaseQuerySchema();
export let appBaseBodySchema = new AppBaseBodySchema();