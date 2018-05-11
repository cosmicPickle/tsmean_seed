import { Response, Request } from "express";

import { IAppRoute, AppRoute } from "./AppRoute";
import { appUnknownUserError, appMongoError, appUnknownGroupError, appRouteValidationError, appGeneralError } from "./../../configuration/errors/errorsConfig";

import { UserGetRequest, UserPostRequest } from "../models/resource/user/UserValidationSchemaTypes";
import { User } from './../models/resource/user/UserMongoModel';

export class UserRoute extends AppRoute {
    protected path = '/user/:name?'

    async get(req: UserGetRequest , res: Response) {
        
        try {
            const user = await User.get().findOne({ 
                username: req.params.name
            });
            res.json(user);
        } catch(e) {
            res.json(e)
        }

        
        // if(req.params.name) {
        //     try {
        //         const user = await User.findOne({
        //             username: req.params.name
        //         }).populate('group').exec();
                
        //         if(!user)
        //             return res.json(appUnknownUserError.get());

        //         return res.json({
        //             user: user.username,
        //             group: user.group.name
        //         });
        //     } catch(err) {
        //         return res.json(appMongoError.parse(err).get());
        //     }
        // } else {
        //     let query = User.find();
        //     if(req.query.country)
        //         query.where('country', req.query.country);
        //     if(req.query.age)
        //         query.where('age').gt(req.query.age.gt).lt(req.query.age.lt);

        //     let userCollection = await (query as IUserDocumentQuery).sortAndPaginate(req)
        //                                                   .populate('group')
        //                                                   .exec();
            
        //     if(!userCollection)
        //         return res.json(appUnknownUserError.get());
            
        //     return res.json(userCollection.map((user) => {
        //         return {
        //             user: user.username,
        //             group: user.group.name,
        //             country: user.country,
        //             age: user.age
        //         }
        //     }))
        // }
    }

    async post(req: UserPostRequest, res: Response) {
        res.json({placeholder: true})
        // let group: IGroup;

        // try {
        //     group = await Group.findOne({
        //         name: req.body.group
        //     });
        // } catch(err) {
        //     return res.json(appMongoError.parse(err).get());
        // }

        // if(!group) 
        //     return res.json(appUnknownGroupError.get())

        // try {
        //     req.body.group = group;
        //     await User.create(req.body);   
        // } catch(err) {
        //     return res.json(appMongoError.parse(err).get());
            
        // }

        // return res.json({
        //     handshake: 'Hi, ' + req.body.username + ' welcome aboard',
        //     status: 'ok'
        // })
    }
}

export let userRoute = new UserRoute();