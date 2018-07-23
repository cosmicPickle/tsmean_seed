import { AppMiddlewareFunction } from "../middlewares/AppMiddleware";
import { appAuthorizationError } from "./../../configuration/errors/errorsConfig";
import { appGeneralError } from "./../../configuration/errors/errorsConfig";
import * as jwt from 'jsonwebtoken';
import config from './../../configuration/general';
import { AppTokenPayload, AppToken } from "../models/AppToken";
import { appGuard } from "../lib/AppGuard";
import { logger } from "../lib/AppLogger";
import { debug } from "util";
import { Auth } from "../../resource/auth";


export class AppAuthenticateMiddleware {
    check: AppMiddlewareFunction  = (req, res, next)  => {
        
        var token = req.body.token || req.query.token || req.header("x-access-token");

        if(!token) {
            //No token was included
            return res.json(appAuthorizationError.get());
        }

        jwt.verify(token, config.jwtSecret, async (err, decoded: AppTokenPayload) => {

            if(err) {
                //The token was invalid
                return res.json(appAuthorizationError.debug(err).get());
            }

            //We need to check if a token like that exists in our database
            let checkToken = await Auth.findOne({ jwt: token });
            
            if(!checkToken) {
                //No token found
                return res.json(appAuthorizationError.get());
            }

            req.body.__djwt = decoded;

            let allowed = false;
            try {
                allowed = await appGuard.service(req);
            } catch(err) {
                return res.json(appGeneralError.debug(err).get());
            }

            if(!allowed) {
                return res.json(appAuthorizationError.get());
            }

            return next();
        });
    }
}

export let appAuthenticateMiddleware = new AppAuthenticateMiddleware();