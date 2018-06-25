import { Request, Response } from 'express';
import AppResource from './../../core/routing/AppResource';
import { appMongoError, appUnknownUserError } from './../../configuration/errors/errorsConfig';


export class GroupResource extends AppResource {
    protected defaultPath = '/group/:id?'

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

export let groupResource = new GroupResource();