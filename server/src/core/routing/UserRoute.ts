import { Response, Request } from "express";

import { IAppRoute, AppRoute } from "./AppRoute";
import { appUnknownUserError, appMongoError, appUnknownGroupError, appRouteValidationError, appGeneralError } from "./../../configuration/errors/errorsConfig";

import { UserGetRequest, UserPostRequest } from "../models/resource/user/UserValidationSchemaTypes";
import { User, userMongoModel, UserMongoModel } from './../models/resource/user/UserMongoModel';
import { Group } from './../models/resource/group/GroupMongoModel';
import { IGroupMongoModel } from "../models/resource/group/IGroupMongoModel";
import { MongoError, ObjectId, DeleteWriteOpResultObject } from "mongodb";
import { AppBaseRequest } from "../models/resource/base/BaseValidationSchemaTypes";
import { IUserMongoModel } from "../models/resource/user/IUserMongoModel";

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
        try {
            const result = await userMongoModel.create(req.body);

            return res.json({
                ops: result.ops.map((o) => {
                    return o.username
                }),
                inserted: result.insertedCount,
                ok: result.result.ok
            })
        } catch(err) {
            if(err instanceof MongoError)
                return res.json(appMongoError.parse(err).get());
            else 
                return res.json(appGeneralError.debug(err).get());
        }
    }

    async put(req: UserPostRequest, res: Response) {
        if(!req.params.name) {
            return res.json(appUnknownUserError.get());
        }
        
        try {
            const result = await userMongoModel.update(req.params.name, req.body, 'username');
            
            if(!result.matchedCount)
                return res.json(appUnknownUserError.get());
                
            return res.json({
                matched: result.matchedCount,
                modified: result.modifiedCount,
                ok: result.result.ok
            })
        } catch(err) {
            if(err instanceof MongoError)
                return res.json(appMongoError.parse(err).get());
            else 
                return res.json(appGeneralError.debug(err).get());
        }
    }

    async delete(req: AppBaseRequest, res: Response) {

        if(!req.params.name) {
            return res.json(appUnknownUserError.get());
        }

        try {
            const result = await userMongoModel.delete(req.params.name, "username");
            
            if(!result.deletedCount)
                return res.json(appUnknownUserError.get());
                
            return res.json({
                deleted: result.deletedCount,
                ok: result.result.ok
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