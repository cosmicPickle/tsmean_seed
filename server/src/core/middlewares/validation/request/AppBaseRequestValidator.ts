import * as Joi from 'joi';
import { Request } from 'express';

export class AppBaseQuerySchema {
    __filtersSchema: { [key: string]: Joi.AnySchema };
    __sortSchema: Joi.StringSchema = Joi.string();
    __orderSchema: Joi.NumberSchema = Joi.number().valid(-1, 1);
    __pageSchema: Joi.NumberSchema = Joi.number().min(0);
    getSchema: () => Joi.ObjectSchema = () => {
        let _schema = Joi.object();
        let keys: any = {};
        Object.keys(this.__filtersSchema).forEach((val) => {
            keys[val] = this.__filtersSchema[val]; 
        });
        keys.sort = this.__sortSchema;
        keys.order = this.__orderSchema;
        keys.page = this.__pageSchema;
        
        return _schema.keys(keys);
    } 
}

export let appBaseQuerySchema = new AppBaseQuerySchema();

export class AppBaseBodySchema {

}

export let appBaseBodySchema = new AppBaseBodySchema();

export class AppBaseRequestValidator<T extends AppBaseQuerySchema, U extends AppBaseBodySchema> {
    __querySchema: Joi.ObjectSchema;
    __bodySchema: Joi.ObjectSchema;
    
    constructor(querySchema: T, bodySchema: U) {
        this.__querySchema = querySchema.getSchema();
    }

    validateQuery: (query: any) => Promise<boolean> = (query) => {
        return new Promise<boolean>((resolve, reject) => {
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

    validate: (req: Request) => Promise<any> = (req) => {
        return Promise.all([
            this.validateQuery(req.query)
        ]);
    }
}
