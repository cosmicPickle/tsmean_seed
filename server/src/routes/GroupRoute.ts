import { Request, Response } from 'express';
import AppRoute from './../core/routing/AppRoute';
import { Group } from './../models/db/mongo/GroupDocument';
import { appMongoError } from './../errors/AppMongoError'
import { appUnknownUserError } from './../errors/AppUnknownUserError'
import { AppServicePath } from '../core/models/AppServicePath';
import { logger } from '../core/lib/AppLogger';
export class GroupRoute extends AppRoute {
    protected path = '/group/:id?'

    async post(req: Request, res: Response) {
        try {
            let group = new Group();
            group.name = req.body.name;
            group.allowedRoutes = req.body.allowedRoutes;
            group.allowedServices = req.body.allowedServices as AppServicePath[];
            
            await group.save();
            
            return res.json({
                success: 'Group Saved',
                status: 'ok'
            })
        } catch(err) {
            return res.json(appMongoError.parse(err).get());
        }
        
    }
}

export let groupRoute = new GroupRoute();