import { Request, Response } from 'express';
import AppRoute from './../core/routing/AppRoute';
import { User } from './../core/models/db/mongo/UserDocument';
import { appMongoError } from './../configuration/errors/errorsConfig';
import { appUnknownUserError } from './../configuration/errors/errorsConfig';
import { appUnknownGroupError } from './../configuration/errors/errorsConfig';
import { Group } from '../core/models/db/mongo/GroupDocument';
import { mongoose } from '../core/models/db/mongo/connection';
import { logger } from '../core/lib/AppLogger';
export class UserRoute extends AppRoute {
    protected path = '/user/:name?'

    async get(req: Request, res: Response) {
        try {
            const user = await User.findOne({
                username: req.params.name || ''
            }).populate('group').exec();
            
            if(!user)
                return res.json(appUnknownUserError.get());
            else {
                return res.json({
                    handshake: 'Hi, ' + user.username,
                    group: user.group.name,
                    status: 'ok'
                });
            }
        } catch(err) {
            return res.json(appMongoError.parse(err).get());
        }
    }

    async post(req: Request, res: Response) {
        try {
            const group = await Group.findOne({
                name: req.body.group
            });

            if(!group) 
                return res.json(appUnknownGroupError.get())

            let user = new User();

            user.username = req.body.username;      
            user.password = req.body.password;
            user.group = group._id;

            await user.save();

            return res.json({
                handshake: 'Hi, ' + user.username + ' welcome aboard',
                status: 'ok'
            })
        } catch(err) {
            return res.json(appMongoError.parse(err).get());
        }
    }
}

export let userRoute = new UserRoute();