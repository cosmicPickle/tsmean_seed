import { AppMiddlewareFunction } from "../middlewares/AppMiddleware";
import { appAuthorizationError } from "./../../configuration/errors/errorsConfig";
import { appGeneralError } from "./../../configuration/errors/errorsConfig";
import * as jwt from 'jsonwebtoken';
import config from './../../configuration/general';
import { AppTokenPayload, AppToken } from "../models/AppToken";
import { appGuard } from "../lib/AppGuard";
import { logger } from "../lib/AppLogger";


export class AppAuthenticateMiddleware {
    check: AppMiddlewareFunction  = (req, res, next)  => {
        logger.debug("Hi");
        
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!token) {
            return res.json(appAuthorizationError.get());
        }

        jwt.verify(token, config.jwtSecret, async (err, decoded: AppTokenPayload) => {
            if(err) {
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
        })
    }
}

export let appAuthenticateMiddleware = new AppAuthenticateMiddleware();