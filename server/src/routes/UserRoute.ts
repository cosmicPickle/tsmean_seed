import { Request, Response } from 'express';
import AppRoute from './../core/routing/AppRoute';
import { User } from './../models/db/mongo/UserModel';
import { appMongoError } from './../errors/AppMongoError'
import { appUnknownUserError } from './../errors/AppUnknownUserError'
export class UserRoute extends AppRoute {
    protected path = '/user/:name?'

    async get(req: Request, res: Response) {
        try {
            const user = await User.findOne({
                username: req.params.name || ''
            });
            
            if(!user)
                return res.json(appUnknownUserError.get());
            else {
                return res.json({
                    handshake: 'Hi, ' + user.username,
                    hasPermission: user.hasPermission(1),
                    status: 'ok'
                })
            }
        } catch(err) {
            return res.json(appMongoError.get());
        }
        
    }
}

export let userRoute = new UserRoute();