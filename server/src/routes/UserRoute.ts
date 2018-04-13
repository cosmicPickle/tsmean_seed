import { Request, Response } from 'express';
import AppRoute from './../core/routing/AppRoute';
import { User } from './../models/db/mongo/UserModel';
import { appMongoError } from './../errors/AppMongoError';
import { appUnknownUserError } from './../errors/AppUnknownUserError';
import { appUnknownGroupError } from './../errors/AppUnknownGroupError';
import { Group } from '../models/db/mongo/GroupModel';
export class UserRoute extends AppRoute {
    protected path = '/user/:name?'

    async get(req: Request, res: Response) {
        try {
            const user = await User.findOne({
                username: req.params.name || ''
            }).populate('group');
            
            if(!user)
                return res.json(appUnknownUserError.get());
            else {
                return res.json({
                    handshake: 'Hi, ' + user.username,
                    group: user.group.name,
                    status: 'ok'
                })
            }
        } catch(err) {
            let e = appMongoError.get();
            e.message += ` ${err}`;
            return res.json(e);
        }
    }

    async post(req: Request, res: Response) {
        try {
            const group = await Group.findOne({
                name: 'newbie'
            });

            if(!group) 
                return res.json(appUnknownGroupError.get())

            let user = new User();

            user.username = req.params.name;      
            user.password = req.body.password;
            user.group = group._id;

            await user.save();

            return res.json({
                handshake: 'Hi, ' + user.username + ' welcome aboard',
                status: 'ok'
            })
        } catch(err) {
            let e = appMongoError.get();
            e.message += ` ${err}`;
            return res.json(e);
        }
    }
}

export let userRoute = new UserRoute();