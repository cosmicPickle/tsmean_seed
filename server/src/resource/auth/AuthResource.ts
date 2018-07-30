import { Response, CookieOptions } from "express";
import { MongoError } from "mongodb";
import * as jwt from 'jsonwebtoken';
import { AppResource } from "./../../core/routing/AppResource";
import { validator, middlewares } from "./middlewares";
import { authMongoModel, Auth, IAuthMongoModel } from './models/mongo/';
import { AppBaseRequest } from "../../core/models/resource/base/BaseValidationSchemaTypes";
import { appNotFoundError, appDuplicateLogin, appMongoError, appGeneralError, appUnknownUserError } from "../../configuration/errors/errorsConfig";
import { AuthPostRequest } from ".";
import config from "../../configuration/general";
import { User, userMongoModel } from "../user";
import * as md5 from 'md5';
import { AppTokenPayload } from "../../core/models/AppToken";

export class AuthResource extends AppResource {
    protected defaultPath = '/auth/:jwt?';
    protected validator = validator; 
    protected middlewares = middlewares;
    protected model = authMongoModel;


    async post(req: AuthPostRequest, res: Response) {

        let cookieOptions: CookieOptions = {
            httpOnly: true
        };

        if(config.jwtCookieExpire > 0) 
            cookieOptions.maxAge = config.jwtCookieExpire;

            let checkUser = null;

        try {
            //Check if user exists and password is correct
            checkUser = await userMongoModel.readOne(req.body.user, "username", "extendedWId", { group: "extended"}); 
        } catch(err) {
            if(err instanceof MongoError)
                return res.json(appMongoError.parse(err).get());
            else 
                return res.json(appGeneralError.debug(err).get());
        }

        if(!checkUser || checkUser.password != md5(req.body.password + config.pswdSalt)) {
            return res.json(appUnknownUserError.get());
        }

        //Check if a session for this user exists
        if(!config.allowDuplicateLogin) {

            try {
                let hasSession = await this.model.get().findOne({
                    user: checkUser._id
                });

                if(hasSession) {
                    let token = (req as any).body.token || (req as any).query.token || req.headers['x-access-token'];

                    if(token && token == hasSession.jwt) {
                        res.cookie(config.jwtCookieName, hasSession.jwt, cookieOptions);
                        return res.json({ success: true });
                    }
                    
                    req.params.jwt = hasSession.jwt;
                    await this.delete(req, res);

                    return res.json(appDuplicateLogin.get());
                }
            } catch(err) {
                if(err instanceof MongoError)
                    return res.json(appMongoError.parse(err).get());
                else 
                    return res.json(appGeneralError.debug(err).get());
            }
        }

        checkUser.allowedServices = checkUser.allowedServices ? checkUser.allowedServices : [];
        checkUser.group.allowedServices = checkUser.group.allowedServices ? checkUser.group.allowedServices : [];
        checkUser.allowedRoutes = checkUser.allowedRoutes ? checkUser.allowedRoutes : [];
        checkUser.group.allowedRoutes = checkUser.group.allowedRoutes ? checkUser.group.allowedRoutes : [];

        let payload: AppTokenPayload = {
            sub: checkUser._id.toHexString(),
            iss: req.baseUrl,
            aud: req.baseUrl,
            scopes: {
                services: [...checkUser.allowedServices, ...checkUser.group.allowedServices],
                routes: [...checkUser.allowedRoutes, ...checkUser.group.allowedRoutes]
            }
        }

        if(config.jwtCookieExpire > 0) {
            payload.exp = new Date().getTime() + config.jwtCookieExpire;
        }

        let token: string = jwt.sign(payload, config.jwtSecret);
        let entity = {
            user: checkUser._id,
            jwt: token

        }
        authMongoModel.create(entity);

        res.cookie(config.jwtCookieName, token, cookieOptions);
        return res.json({ success: true });
    }
    
    async put(req: AppBaseRequest, res: Response) {
        return res.status(404).json(appNotFoundError.get())
    }
}

export let authResource = new AuthResource();