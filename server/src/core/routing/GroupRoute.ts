import { Request, Response } from 'express';
import AppRoute from './AppRoute';
import { appMongoError, appUnknownUserError } from './../../configuration/errors/errorsConfig';
import { logger } from '../lib/AppLogger';


export class GroupRoute extends AppRoute {
    protected path = '/group/:id?'

    async post(req: Request, res: Response) {
        res.json({placeholder: true})
        // try {
        //     let group = new Group();
        //     group.name = req.body.name;
        //     group.allowedRoutes = req.body.allowedRoutes;
        //     group.allowedServices = req.body.allowedServices;
            
        //     await group.save();
            
        //     return res.json({
        //         success: 'Group Saved',
        //         status: 'ok'
        //     })
        // } catch(err) {
        //     return res.json(appMongoError.parse(err).get());
        // }
        
    }
}

export let groupRoute = new GroupRoute();