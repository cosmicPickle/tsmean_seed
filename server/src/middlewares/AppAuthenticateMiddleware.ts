import { AppMiddlewareFunction } from "../core/middlewares/AppMiddleware";
import { appAuthorizationError } from "../errors/AppAuthorizationError";
import { appGeneralError } from "../errors/AppGeneralError";
import * as jwt from 'jsonwebtoken';
import config from './../configuration/general';
import { AppTokenPayload, AppToken } from "../core/models/AppToken";
import { appGuard } from "../core/lib/AppGuard";
import { logger } from "../core/lib/AppLogger";


export class AppAuthenticateMiddleware {
    check: AppMiddlewareFunction  = (req, res, next)  => {
        
        
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
                logger.error(err);
                return res.json(appGeneralError.get());
            }

            
            if(!allowed) {
                return res.json(appAuthorizationError.get());
            }
            return next();
        })
    }
}

export let appAuthenticateMiddleware = new AppAuthenticateMiddleware();