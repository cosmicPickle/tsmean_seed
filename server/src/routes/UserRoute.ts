import { Response, Request } from "express";

import { AppRoute } from "../core/routing/AppRoute";
import { appUnknownUserError, appMongoError, appUnknownGroupError } from "../configuration/errors/errorsConfig";

import { UserGetRequest, IUserDocumentQuery } from "../core/models/resource/user/types";
import { User } from "../core/models/resource/user/UserDocument";
import { Group } from "../core/models/resource/group/GroupDocument";



export class UserRoute extends AppRoute<UserGetRequest> {
    protected path = '/user/:name?'

    async get(req: UserGetRequest, res: Response) {
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
            let query = User.find();
            if(req.query.country)
                query.where('country', req.query.country);
            if(req.query.age)
                query.where('age').gt(req.query.age.gt).lt(req.query.age.lt);

            let userCollection = await (query as IUserDocumentQuery).sortAndPaginate(req)
                                                          .populate('group')
                                                          .exec();
            
            if(!userCollection)
                return res.json(appUnknownUserError.get());
            
            return res.json(userCollection.map((user) => {
                return {
                    user: user.username,
                    group: user.group.name,
                    country: user.country,
                    age: user.age
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
            req.body.group = group;

            await User.create(req.body);

            return res.json({
                handshake: 'Hi, ' + req.body.username + ' welcome aboard',
                status: 'ok'
            })
        } catch(err) {
            return res.json(appMongoError.parse(err).get());
        }
    }
}

export let userRoute = new UserRoute();