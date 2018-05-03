import { IBaseDocumentQuery } from './../core/models/db/mongo/BaseDocument';
import { Request, Response } from 'express';
import AppRoute from './../core/routing/AppRoute';
import { User, IUserDocumentQuery } from './../core/models/db/mongo/UserDocument';
import { appMongoError } from './../configuration/errors/errorsConfig';
import { appUnknownUserError } from './../configuration/errors/errorsConfig';
import { appUnknownGroupError } from './../configuration/errors/errorsConfig';
import { Group } from '../core/models/db/mongo/GroupDocument';
import { mongoose } from '../core/models/db/mongo/connection';
import { logger } from '../core/lib/AppLogger';
import { UserRouteRequest } from '../models/routing/request/UserRouteRequest';

export class UserRoute extends AppRoute<UserRouteRequest> {
    protected path = '/user/:name?'

    async get(req: UserRouteRequest, res: Response) {
        if(req.params.name) {
            try {
                const user = await User.findOne({
                    username: req.params.name
                }).populate('group').exec();
                
                if(!user)
                    return res.json(appUnknownUserError.get());

                return res.json({
                    user: user.username,
                    group: user.group.name
                });
            } catch(err) {
                return res.json(appMongoError.parse(err).get());
            }
        } else {
            let query = User.find() as IUserDocumentQuery;

            if(req.query.country)
                query.filter(req.query.country);

            const userCollection = await query.sortAndPaginate(req)
                                              .populate('group')
                                              .exec();
            
            if(!userCollection)
                return res.json(appUnknownUserError.get());
            
            return res.json(userCollection.map((user) => {
                return {
                    user: user.username,
                    group: user.group.name,
                    country: user.country
                }
            }))
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
            user.country = req.body.country;
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