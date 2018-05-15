import { Response, Request } from "express";

import { IAppRoute, AppRoute } from "./AppRoute";
import { appUnknownUserError, appMongoError, appUnknownGroupError, appRouteValidationError, appGeneralError } from "./../../configuration/errors/errorsConfig";

import { UserGetRequest, UserPostRequest } from "../models/resource/user/UserValidationSchemaTypes";
import { User, userMongoModel } from './../models/resource/user/UserMongoModel';
import { Group } from './../models/resource/group/GroupMongoModel';
import { IGroupMongoModel } from "../models/resource/group/IGroupMongoModel";
import { MongoError } from "mongodb";

export class UserRoute extends AppRoute {
    protected path = '/user/:name?'

    async get(req: UserGetRequest , res: Response) {  

        if(req.params.name) {
            try {
                
                const user = await User.aggregate([{
                    $match: { username: req.params.name },
                }, ...userMongoModel.getLookup()]).next();
                
                if(!user)
                    return res.json(appUnknownUserError.get());

                return res.json({
                    user: user.username,
                    group: user.group.name,
                    country: user.country,
                    age: user.age
                });

            } catch(err) {
                if(err instanceof MongoError)
                    return res.json(appMongoError.parse(err).get());
                else 
                    return res.json(appGeneralError.debug(err).get());
            }
        } else {
            let userCollection;
            try {
                userCollection = await userMongoModel.read(req);
            

                if(!userCollection)
                    return res.json(appUnknownUserError.get());
                
                return res.json(userCollection.map((user) => {
                    return {
                        user: user.username,
                        group: user.group && (user.group as IGroupMongoModel).name,
                        country: user.country,
                        age: user.age
                    }
                }))
            } catch(err) {
                if(err instanceof MongoError)
                    return res.json(appMongoError.parse(err).get());
                else 
                    return res.json(appGeneralError.debug(err).get());
            }
        }
    }

    async post(req: UserPostRequest, res: Response) {

        let group: IGroupMongoModel;

        try {
            group = await Group.findOne({
                name: req.body.group
            });
        } catch(err) {
            return res.json(appMongoError.parse(err).get());
        }

        if(!group) 
            return res.json(appUnknownGroupError.get())

        try {
            let payload = Object.assign({}, req.body, { group: group._id });
            await User.insert(payload);   

            return res.json({
                handshake: req.body.username,
            })
        } catch(err) {
            if(err instanceof MongoError)
                return res.json(appMongoError.parse(err).get());
            else 
                return res.json(appGeneralError.debug(err).get());
        }
 
    }
}

export let userRoute = new UserRoute();