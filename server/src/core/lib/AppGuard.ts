import * as pathToRegexp from 'path-to-regexp'
import { Request } from 'express';
import { AppServicePath } from '../models/AppServicePath';
import { logger } from './AppLogger';
import { userMongoModel } from '../../resource/user';
import config from '../../configuration/general';
import { AppTokenPayload } from '../models/AppToken';
export class AppGuard {

    private _checkServices(services: AppServicePath[], controlMethod: string, controlUrl: string): boolean {
        
        return services.some((service) => {
            console.log(service, controlMethod, controlUrl, service.method.toLowerCase() === controlMethod.toLowerCase(), service.path == controlUrl, pathToRegexp(service.path));
            if(service.method.toLowerCase() === controlMethod.toLowerCase()
                && (service.path == controlUrl 
                    || pathToRegexp(service.path).test(controlUrl)
                )) {
                    return true;
            }

            return false;
        });
    }

    private _checkRoutes(routes: string[], controlUrl: string): boolean {
        return routes.some(route => {
            if(route === controlUrl || pathToRegexp(route).test(controlUrl)) {
                return true;
            }
            return false;
        });
    }

    async service(req: Request) : Promise<boolean> {
        if(!req.body.__djwt || !req.body.__djwt.sub)
            return false;

        if(!req.body.__djwt.scopes || !req.body.__djwt.scopes.services) {
            //There is no reason for the scopes to be unset
            return false;
        } else {
            return this._checkServices(req.body.__djwt.scopes.services, req.method, req.url);
        }
    }

    async route(req: Request): Promise<boolean> {
        if(!req.body.__djwt || !req.body.__djwt.sub || !req.body.route)
            return false;

        if(!req.body.__djwt.scopes || !req.body.__djwt.scopes.routes) {
            return false;
        } else {
            return this._checkRoutes(req.body.__djwt.scopes.routes, req.body.route);
        }
    }

}

export const appGuard = new AppGuard();