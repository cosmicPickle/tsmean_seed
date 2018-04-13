import { AppMiddlewareFunction } from "../core/middlewares/AppMiddleware";
import { AppAuthorizationError } from "../errors/AppAuthorizationError";
import * as jwt from 'jsonwebtoken';
import config from './../configuration/general';
import { AppTokenPayload, AppToken } from "../core/models/AppToken";
export class AppAuthenticateMiddleware {
    check: AppMiddlewareFunction  = (req, res, next)  => {
        
        
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if(!token) {
            return res.json(new AppAuthorizationError().get());
        }

        jwt.verify(token, config.jwtSecret, (err, decoded: AppTokenPayload) => {
            if(err) {
                return res.json(new AppAuthorizationError().get());
            }

            req.body.__djwt = decoded;
            return next();
        })
    }
}

export let appAuthenticateMiddleware = new AppAuthenticateMiddleware();