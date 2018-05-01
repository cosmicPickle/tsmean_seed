import * as Joi from 'joi';
import { Request } from 'express';

export class AppBaseQuerySchema {
    __filtersSchema: { [key: string]: Joi.AnySchema };
    __sortSchema: Joi.StringSchema = Joi.string();
    __orderSchema: Joi.NumberSchema = Joi.number().valid(-1, 1);
    __pageSchema: Joi.NumberSchema = Joi.number().min(0);
    set sort(val) {
        this.__sortSchema = val;
    }
    set order(val) {
        this.__orderSchema = val;
    }
    set page(val) {
        this.__pageSchema = val;
    }
    set filters(val) {
        this.__filtersSchema = val;
    }
    getSchema: () => Joi.ObjectSchema = () => {
        let _schema = Joi.object();
        let keys: any = {};

        if(this.__filtersSchema) {
            Object.keys(this.__filtersSchema).forEach((val) => {
                keys[val] = this.__filtersSchema[val]; 
            });
        }
        
        keys.sort = this.__sortSchema;
        keys.order = this.__orderSchema;
        keys.page = this.__pageSchema;
        
        return _schema.keys(keys);
    } 
}

export class AppBaseBodySchema {
    __uuidSchema: Joi.StringSchema = Joi.string();
    __dataSchema: { [key: string]: Joi.AnySchema };

    set uuid(val) {
        this.__uuidSchema = val;
    }

    set data(val) {
        this.__dataSchema = val;
    }

    getSchema: () => Joi.ObjectSchema = () => {
        let _schema = Joi.object();
        let keys: any = {};

        if(this.__dataSchema) {
            Object.keys(this.__dataSchema).forEach((val) => {
                keys[val] = this.__dataSchema[val]; 
            });
        }
        
        keys.uuid = this.__uuidSchema;
        return _schema.keys(keys);
    } 
}
export class AppBaseRequestValidator<T extends AppBaseQuerySchema, U extends AppBaseBodySchema> {
    __querySchema: Joi.ObjectSchema;
    __bodySchema: Joi.ObjectSchema;
    
    constructor(querySchema: T, bodySchema: U) {
        this.__querySchema = querySchema.getSchema();
        this.__bodySchema = bodySchema.getSchema();
    }

    validateQuery: (query: any) => Promise<boolean> = (query) => {
        return new Promise<boolean>((resolve, reject) => {
            if(!this.__querySchema) {
                resolve(true);
                return;
            }

            try {
                const { error, value } = Joi.validate(query, this.__querySchema);

                if(error)
                    throw error;

                resolve(true);
            } catch (e) {
                throw e;
            }
        })
    }

    validateBody: (body: any) => Promise<boolean> = (body) => {
        return new Promise<boolean>((resolve, reject) => {
            if(!this.__bodySchema) {
                resolve(true);
                return;
            }

            try {
                const { error, value } = Joi.validate(body, this.__bodySchema);

                if(error)
                    throw error;

                resolve(true);
            } catch (e) {
                throw e;
            }
        })
    }

    validate: (req: Request) => Promise<any> = (req) => {
        return Promise.all([
            this.validateQuery(req.query),
            this.validateBody(req.body)
        ]);
    }
}
