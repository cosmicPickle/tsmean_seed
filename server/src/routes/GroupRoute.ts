import { Request, Response } from 'express';
import AppRoute from './../core/routing/AppRoute';
import { Group } from './../core/models/db/mongo/GroupDocument';
import { appMongoError } from './../configuration/errors/errorsConfig'
import { appUnknownUserError } from './../configuration/errors/errorsConfig'
import { AppServicePath } from '../core/models/AppServicePath';
import { logger } from '../core/lib/AppLogger';
import { GroupRouteRequest } from '../models/routing/request/GroupRouteRequest';

export class GroupRoute extends AppRoute<GroupRouteRequest> {
    protected path = '/group/:id?'

    async post(req: GroupRouteRequest, res: Response) {
        try {
            req.body
            let group = new Group();
            group.name = req.body.name;
            group.allowedRoutes = req.body.allowedRoutes;
            group.allowedServices = req.body.allowedServices;
            
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