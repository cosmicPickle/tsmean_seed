import { Response } from "express";
import { MongoError, DeleteWriteOpResultObject } from "mongodb";

import { AppResource, RouteMethods } from "./../../core/routing/AppResource";
import { AppBaseRequest } from "./../../core/models/resource/base/BaseValidationSchemaTypes";
import { 
    appUnknownUserError, 
    appMongoError, 
    appUnknownGroupError, 
    appRouteValidationError, 
    appGeneralError 
} from "./../../configuration/errors/errorsConfig";

import { validator, middlewares } from "./middlewares";
import { UserGetRequest, UserPostRequest } from "./models/validation";
import { User, userMongoModel } from './models/mongo/';
import { IGroupMongoModel } from "../group/models/mongo";



export class UserResource extends AppResource {
    protected defaultPath = '/user/:name?';
    protected validator = validator; 
    protected middlewares = middlewares;
    
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

export let userResource = new UserResource();