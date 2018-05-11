
import * as Joi from 'joi';

export class BaseSchema {
    validate(obj): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            let _schema = Joi.object();
            let keys: Joi.SchemaMap = {};
            
            Object.keys(this).forEach((k) => {
                return keys[k] = this[k];
            })


            if(!keys) {
                resolve(true);
                return;
            }

            try {
                _schema = (_schema as Joi.ObjectSchema).keys(keys);

                const { error, value } = Joi.validate(obj, _schema);
                
                if(error)
                    throw error;

                resolve(true);
            } catch (e) {
                throw e;
            }
        })
    }
}

export namespace SchemaHelpers {
    
    export const lt = {
        lt: Joi.number().integer().min(Joi.ref('gt'))
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

export class AppBaseQuerySchema extends BaseSchema {
    sort: Joi.StringSchema = Joi.string().regex(/^(\-|[a-zA-Z0-9\_])/);
    page: Joi.NumberSchema = Joi.number().min(0);
}

export class AppBaseBodySchema extends BaseSchema {
    
}