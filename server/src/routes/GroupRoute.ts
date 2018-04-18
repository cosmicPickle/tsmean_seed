import { Request, Response } from 'express';
import AppRoute from './../core/routing/AppRoute';
import { Group } from './../models/db/mongo/GroupDocument';
import { appMongoError } from './../errors/AppMongoError'
import { appUnknownUserError } from './../errors/AppUnknownUserError'
export class GroupRoute extends AppRoute {
    protected path = '/group/'

    async post(req: Request, res: Response) {
        try {
            let group = new Group();
            group.name = 'newbie';
            group.allowedServices = ['get:/user/{{sub}}'];
            group.allowedRoutes = ['profile', 'favorites'];

            await group.save();
            
            return res.json({
                success: 'Group Saved',
                status: 'ok'
            })
        } catch(err) {
            return res.json(appMongoError.get());
        }
        
    }
}

export let groupRoute = new GroupRoute();