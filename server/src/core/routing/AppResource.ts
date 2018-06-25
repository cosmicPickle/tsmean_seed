import { appInvalidRouteError } from './../../configuration/errors/errorsConfig';
import { Request, Response, Router } from 'express';
import middlewaresConfig from './../../configuration/middlewares/middlewaresConfig';
import * as base from '../models/resource/base/BaseValidationSchemaTypes';
import { AppMiddleware, AppMiddlewareFunction } from '../middlewares/AppMiddleware';
import { middlewares } from '../../resource/user/middlewares';
import { logger } from '../lib/AppLogger';

export enum RouteMethods {
    get, 
    post, 
    put, 
    delete
}

export interface AppRouteConfig {
    path: string,
    absolutePath: boolean,
    method: RouteMethods,
    handler: AppMiddlewareFunction,
}

export interface AppRoute {
    path: string,
    method: RouteMethods
    executionChain: AppMiddlewareFunction[]
}

export class AppResource {
    protected defaultPath: string;
    protected validator: AppMiddleware;
    protected middlewares: AppMiddleware;
    protected routes: AppRoute[] = [];
    /**
     * example: 
     *  protected additionalRoutes = {
     *       test: {
     *          path: '/test',
     *           absolutePath: true,
     *           method: RouteMethods.post,
     *           handler: (req, res) => this.test(req, res)
     *       }
     *   }
     */
    protected additionalRoutes: {[key: string] : AppRouteConfig} = {};

    init() { 
        for(let method in RouteMethods) {

            if(isNaN(Number(method))) {
                let executionChain: AppMiddlewareFunction[] = [];
                if(this.validator && this.validator[method])
                    executionChain.push(...this.validator[method]);
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

        Object.keys(this.additionalRoutes).forEach(key => {
            let route: AppRouteConfig = this.additionalRoutes[key];
            let executionChain: AppMiddlewareFunction[] = [];
            if(this.validator && this.validator[key])
                executionChain.push(...this.validator[key]);
            if(this.middlewares && this.middlewares[key])
                executionChain.push(...this.middlewares[key]);

            executionChain.push(route.handler);

            let path: string = route.absolutePath ? route.path : (this.defaultPath + route.path);

            this.routes.push({
                path: path,
                method: route.method,
                executionChain: executionChain
            })
        });
    }
    get<T extends base.AppBaseRequest<any, any>>(req: T, res: Response) {
        return this.default(req, res);
    } 
    post<T extends base.AppBaseRequest<any, any>>(req: T, res: Response) {
        return this.default(req, res);
    } 
    put<T extends base.AppBaseRequest<any, any>>(req: T, res: Response) {
        return this.default(req, res);
    } 
    delete<T extends base.AppBaseRequest<any, any>>(req: T, res: Response) {
        return this.default(req, res);
    } 
    default<T extends base.AppBaseRequest<any, any>>(req: T, res: Response) {
        res.json(appInvalidRouteError.get());
    } 

    mountRoutes(router: Router) {
        this.routes.forEach(route => {
            router[RouteMethods[route.method]](route.path, route.executionChain);
        });
    }
}

export default AppResource;