import { appInvalidRouteError, appMongoError, appGeneralError, appUnknownEntityError } from './../../configuration/errors/errorsConfig';
import { Request, Response, Router } from 'express';
import middlewaresConfig from './../../configuration/middlewares/middlewaresConfig';
import * as base from '../models/resource/base/BaseValidationSchemaTypes';
import { AppMiddleware, AppMiddlewareFunction } from '../middlewares/AppMiddleware';
import { logger } from '../lib/AppLogger';
import { BaseMongoModel } from '../models/resource/base/BaseMongoModel';
import { MongoError } from 'mongodb';
import { AppUnknownEntityError } from '../errors/AppUnknownEntityError';

export enum RouteMethods {
    get, 
    post, 
    put, 
    delete
}

export interface AppRouteConfig {
    /**
     * @property string
     * 
     * The path of the route. If absolute path is false this path is relative
     * to the resource defaultPath
     */
    path: string,
    /**
     * @property boolean
     * 
     * Determines whether the path is rendered relative to the parent resource
     * or absolute to the API base URL
     */
    absolutePath: boolean,
    /**
     * @property  RouteMethods
     * 
     * The method of the route (get, post, put, delete)
     */
    method: RouteMethods,
    /**
     * @property AppMiddlewareFunction
     * 
     * The function which is to be executed as the route handler. Note that
     * in case of using a function of the parent resource attaching it like
     * 
     * handler: this.foo will make the resource protected variables and methods
     * unavailable
     * 
     * use lambda function instead
     * handler: (req, res) => this.foo(req, res)
     */
    handler: AppMiddlewareFunction,
}

export interface AppRoute {
    path: string,
    method: RouteMethods
    executionChain: AppMiddlewareFunction[]
}

export class AppResource<
    G extends base.AppBaseRequest = base.AppBaseRequest, 
    P extends base.AppBaseRequest = base.AppBaseRequest
> {
    /**
     * @property string
     * 
     * This is the API path at which this resource defines default CRUD operations. 
     * It is also used as a base path for any additionaRoute that has absolutePath
     * set to false
     */
    protected defaultPath: string;
    /**
     * @property AppMiddleware
     * 
     * A special middleware which takes care of route validations. Should implement
     * AppMiddlewareFunction[] the same name as CRUD route operations (get, post, 
     * put, delete) and any other additionalMethods if need be. Can also define multiple 
     * validators.
     */
    protected validator: AppMiddleware;
    /**
     * @property AppMiddleware
     * 
     * All middlewares which should be applied before a route is called. Should implement
     * AppMiddlewareFunction[] the same name as CRUD route operations (get, post, 
     * put, delete) and any other additionalMethods if need be. Can also define multiple 
     * validators.
     */
    protected middlewares: AppMiddleware;
    protected model: BaseMongoModel<any>;
    /**
     * @property AppRoute[]
     * This is an array with the routes prepared and their execution chains set. Should not
     * edit directly!
     */
    protected routes: AppRoute[] = [];
    /**
     * @property {[key: string] : AppRouteConfig}
     * 
     * Should you need the resource to implement any additional routes, they should be configured 
     * here. See AppRouteConfig formore info
     * 
     */
    protected additionalRoutes: {[key: string] : AppRouteConfig} = {};

    init() { 
        if(this.defaultPath.length > 0) {
            for(let method in RouteMethods) {

                if(isNaN(Number(method))) {
                    let executionChain: AppMiddlewareFunction[] = [];
                    if(this.validator && this.validator[method])
                        executionChain.push(...this.validator[method]);
                    if(this.middlewares && this.middlewares._)
                        executionChain.push(...this.middlewares._);
                    if(this.middlewares && this.middlewares[method])
                        executionChain.push(...this.middlewares[method]);

                    executionChain.push((req, res) => this[method](req, res));
                    this.routes.push({ 
                        path: this.defaultPath,
                        method: (<any>RouteMethods)[method],
                        executionChain: executionChain
                    })
                }
            }
        }

        for(let key in this.additionalRoutes) {
            let route: AppRouteConfig = this.additionalRoutes[key];

            if(route.path.length == 0)
                continue;

            let executionChain: AppMiddlewareFunction[] = [];
            if(this.validator && this.validator[key])
                executionChain.push(...this.validator[key]);
            if(this.middlewares && this.middlewares._)
                executionChain.push(...this.middlewares._);
            if(this.middlewares && this.middlewares[key])
                executionChain.push(...this.middlewares[key]);

            executionChain.push(route.handler);

            let path: string = route.absolutePath ? route.path : (this.defaultPath + route.path);
            
            this.routes.push({
                path: path,
                method: route.method,
                executionChain: executionChain
            })
        };
    }
    async get(req: G, res: Response) {
        if(!this.model) {
            logger.error("Model not set for " + this.constructor.name);
            return res.json(appGeneralError.debug(new Error("Model not set.")).get());
            
        }
        if(req.params[this.model.lookupField]) {
            try {
                
                const entity = await this.model.readOne(
                    req.params[this.model.lookupField], 
                    this.model.lookupField, 
                    'extended'
                );
                
                if(!entity)
                    return res.json(appUnknownEntityError.get());

                return res.json(entity);

            } catch(err) {
                if(err instanceof MongoError)
                    return res.json(appMongoError.parse(err).get());
                else 
                    return res.json(appGeneralError.debug(err).get());
            }
        } else {
            let collection;
            try {
                
                collection = await this.model.read(req);
            

                if(!collection)
                    return res.json(appUnknownEntityError.get());
                
                return res.json(collection);
            } catch(err) {
                if(err instanceof MongoError)
                    return res.json(appMongoError.parse(err).get());
                else 
                    return res.json(appGeneralError.debug(err).get());
            }
        }
    } 
    async post(req: P, res: Response) {
        if(!this.model) {
            logger.error("Model not set for " + this.constructor.name);
            return res.json(appGeneralError.debug(new Error("Model not set.")).get());
            
        }

        try {
            const result = await this.model.create(req.body);

            return res.json({
                ops: result.ops.map((o) => {
                    return o[this.model.lookupField]
                }),
                inserted: result.insertedCount,
                ok: result.result.ok
            })
        } catch(err) {
            if(err instanceof MongoError)
                return res.json(appMongoError.parse(err).get());
            else 
                return res.json(appGeneralError.debug(err).get());
        }
    }

    async put(req: P, res: Response) {
        if(!this.model) {
            logger.error("Model not set for " + this.constructor.name);
            return res.json(appGeneralError.debug(new Error("Model not set.")).get()); 
        }

        if(!req.params[this.model.lookupField]) {
            return res.json(appUnknownEntityError.get());
        }
        
        try {
            const result = await this.model.update(req.params[this.model.lookupField], req.body);
            
            if(!result.matchedCount)
                return res.json(appUnknownEntityError.get());
                
            return res.json({
                matched: result.matchedCount,
                modified: result.modifiedCount,
                ok: result.result.ok
            })
        } catch(err) {
            if(err instanceof MongoError)
                return res.json(appMongoError.parse(err).get());
            else 
                return res.json(appGeneralError.debug(err).get());
        }
    } 
    async delete(req: base.AppBaseRequest, res: Response) {
        if(!req.params[this.model.lookupField]) {
            return res.json(appUnknownEntityError.get());
        }

        try {
            const result = await this.model.delete(req.params[this.model.lookupField]);

            if(!result.deletedCount)
                return res.json(appUnknownEntityError.get());
                
            return res.json({
                deleted: result.deletedCount,
                ok: result.result.ok
            })
        } catch(err) {
            if(err instanceof MongoError)
                return res.json(appMongoError.parse(err).get());
            else 
                return res.json(appGeneralError.debug(err).get());
        }
    } 

    mountRoutes(router: Router) {
        this.routes.forEach(route => {
            router[RouteMethods[route.method]](route.path, route.executionChain);
        });
    }

    protected default<T extends base.AppBaseRequest<any, any>>(req: T, res: Response) {
        res.json(appInvalidRouteError.get());
    } 
}

export default AppResource;