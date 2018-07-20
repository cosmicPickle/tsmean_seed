export class ResourceTemplate {
    constructor(protected template: string) {};
    parse(args: { [key: string]: string}) {
        
        for(let key in args) {
            if(!args.hasOwnProperty(key))
                continue;

            this.template = this.template.replace(new RegExp('\{\{' + key +'\}\}', 'g'), args[key]);
        }

        return this;
    }
    get() {
        return this.template;
    }
}

export let resourceTemplates: { [key: string]: ResourceTemplate } = {
resourceIndex: new ResourceTemplate(
`export * from "./{{namePascalCase}}Resource";
export * from "./models";`
),
resource: new ResourceTemplate(
`import { Response } from "express";
import { MongoError } from "mongodb";

import { AppResource } from "./../../core/routing/AppResource";
import { validator, middlewares } from "./middlewares";
import { {{name}}MongoModel } from './models/mongo/';

export class {{namePascalCase}}Resource extends AppResource {
    protected defaultPath = '{{path}}';
    protected validator = validator; 
    protected middlewares = middlewares;
    protected model = {{name}}MongoModel;
}

export let {{name}}Resource = new {{namePascalCase}}Resource();`
),
middlewaresIndex: new ResourceTemplate(
`import { {{name}}RouteValidatorMiddleware }  from "./{{namePascalCase}}RouteValidatorMiddleware";
import { appAuthenticateMiddleware } from "./../../../core/middlewares/AppAuthenticateMiddleware";
import { AppMiddleware } from "../../../core/middlewares/AppMiddleware";

export let validator: AppMiddleware = {{name}}RouteValidatorMiddleware;
export let middlewares: AppMiddleware = {
    //_: [appAuthenticateMiddleware.check]
}

`
),
routeValidatorMiddleware: new ResourceTemplate(
`import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { AppMiddlewareFunction, AppMiddleware } from './../../../core/middlewares/AppMiddleware';
import { {{name}}GetQuerySchema, {{name}}PostBodySchema, {{name}}PutBodySchema } from './../models/validation';
import { appRouteValidationError } from './../../../configuration/errors/errorsConfig';
import { appBaseBodySchema } from '../../../core/models/resource/base/BaseValidationSchema';

export let {{name}}RouteValidatorMiddleware: AppMiddleware = {
    get: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.query = await {{name}}GetQuerySchema.validate(req.query);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get());
        }
    }],
    post: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.body = await {{name}}PostBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
        }
        
    }],
    put: [async (req: Request, res: Response, next: NextFunction) => { 
        try {
            req.body = await {{name}}PutBodySchema.validate(req.body);
            next();
        } catch(e) {
            res.json(appRouteValidationError.parse(e as Joi.ValidationError).get())
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

`
),
modelsIndex: new ResourceTemplate(
`export * from "./mongo";
export * from "./validation";`
),
mongoIndex: new ResourceTemplate(
`export * from './I{{namePascalCase}}MongoModel';
export * from './{{namePascalCase}}MongoModel';`
),
iMongoModel: new ResourceTemplate(
`import { AppServicePath } from '../../../../core/models/AppServicePath';
import { IBaseMongoModel } from '../../../../core/models/resource/base/IBaseMongoModel';

export interface I{{namePascalCase}}MongoModel extends IBaseMongoModel {
    name: string;
}`
),
mongoModel: new ResourceTemplate(
`import { BaseMongoModel } from './../../../../core/models/resource/base/BaseMongoModel';
import { BaseMongoModelConfig, BaseMongoRelation } from './../../../../core/models/resource/base/BaseMongoTypes';
import { I{{namePascalCase}}MongoModel } from './I{{namePascalCase}}MongoModel';

export class {{namePascalCase}}MongoModel extends BaseMongoModel<I{{namePascalCase}}MongoModel> {
    name = '{{namePlural}}';
    lookupField: '_id' = '_id';
    projections = {
        default: {
            _id: false,
            name: true,
        },
        extended: {
            _id: false,
            name: true,
        }
    }
    resultsPerPage = 10;
    filters = ['name'];
    enableSoftDelete = true;
    relations = {
        
    };
}

export let {{name}}MongoModel = new {{namePascalCase}}MongoModel();
export let {{namePascalCase}} = {{name}}MongoModel.get();`
),
validationIndex: new ResourceTemplate(
`export * from './{{namePascalCase}}ValidationSchema';
export * from './{{namePascalCase}}ValidationSchemaTypes';`
),
validationSchema: new ResourceTemplate(
`import { AppBaseQuerySchema, SchemaHelpers, AppBaseBodySchema } from './../../../../core/models/resource/base/BaseValidationSchema';
import * as Joi from 'joi';

export class {{namePascalCase}}GetQuerySchema extends AppBaseQuerySchema {
    sort = Joi.string().valid('name', '-name');
    name = Joi.string();
}

export class {{namePascalCase}}PutBodySchema extends AppBaseBodySchema {
    name = Joi.string();
}
export class {{namePascalCase}}PostBodySchema extends {{namePascalCase}}PutBodySchema {

    constructor() {
        super();
        this.name = this.name.required();
    }
    
}

export const {{name}}GetQuerySchema = new {{namePascalCase}}GetQuerySchema();
export const {{name}}PostBodySchema = new {{namePascalCase}}PostBodySchema();
export const {{name}}PutBodySchema = new {{namePascalCase}}PutBodySchema();`
),
validationSchemaTypes: new ResourceTemplate(
`import * as base from './../../../../core/models/resource/base/BaseValidationSchemaTypes'
import { AppServicePath } from './../../../../core/models/AppServicePath';
 
 /**
 *  Request query string types
 */
export interface {{namePascalCase}}Query extends base.AppBaseQuery {
    sort: 'name'|'-name'
    name: string
}

/**
 * Request body types
 */
export interface {{namePascalCase}}Body extends base.AppBaseBody {
    name: string;
}
/**
 * Request types
 */
export interface {{namePascalCase}}GetRequest extends base.AppBaseRequest<{{namePascalCase}}Query> {};
export type {{namePascalCase}}PostRequest = base.AppBaseRequest<base.AppBaseQuery, {{namePascalCase}}Body>`
)
}