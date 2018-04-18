import { Request, Response } from 'express';
import AppRoute from './../core/routing/AppRoute';
import { User } from './../models/db/mongo/UserDocument';
import { appMongoError } from './../errors/AppMongoError';
import { appUnknownUserError } from './../errors/AppUnknownUserError';
import { appUnknownGroupError } from './../errors/AppUnknownGroupError';
import { Group } from '../models/db/mongo/GroupDocument';
import { mongoose } from '../core/models/db/mongo/connection';
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
                user.populate('group');
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
                _id: mongoose.Types.ObjectId(req.body.group)
            });

            if(!group) 
                return res.json(appUnknownGroupError.get())

            let user = new User();

            user.username = req.body.username;      
            user.password = req.body.password;
            user.group = group;

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