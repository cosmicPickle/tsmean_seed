import * as pathToRegexp from 'path-to-regexp'
import { Request } from 'express';
import { User } from './../models/resource/user/UserDocument'
import { mongoose } from './../../configuration/db/mongo';
import { AppServicePath } from '../models/AppServicePath';
import { logger } from './AppLogger';
export class AppGuard {

    private _checkServices(services: AppServicePath[], controlMethod: string, controlUrl: string): boolean {
        return services.some((service) => {
            
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
            let user = await User.findOne({
                _id: mongoose.Types.ObjectId(req.body.__djwt.sub)
            }).populate('group').exec();

            if(!user)
                return false;

            req.body.__djwt.scopes.services = [...user.allowedServices, ...user.group.allowedServices];

            if(this._checkServices(user.allowedServices, req.method, req.url)) {
                return true;
            }

            if(this._checkServices(user.group.allowedServices, req.method, req.url)) {
                return true;
            }
            
            return false;
        } else {
            return this._checkServices(req.body.__djwt.scopes.services, req.method, req.url);
        }
    }

    async route(req: Request): Promise<boolean> {
        if(!req.body.__djwt || !req.body.__djwt.sub || !req.body.route)
            return false;

        if(!req.body.__djwt.scopes || !req.body.__djwt.scopes.routes) {
            let user = await User.findOne({
                _id: mongoose.Types.ObjectId(req.body.__djwt.sub)
            }).populate('group').exec();

            if(!user)
                return false;
                
            if(this._checkRoutes(user.allowedRoutes, req.body.route)) {
                return true;
            }

            if(this._checkRoutes(user.group.allowedRoutes, req.body.route)) {
                return true;
            }

            req.body.__djwt.scopes.routes = [...user.allowedRoutes, ...user.group.allowedRoutes];
            
            return false;
        } else {
            return this._checkRoutes(req.body.__djwt.scopes.routes, req.body.route);
        }
    }

}

export const appGuard = new AppGuard();