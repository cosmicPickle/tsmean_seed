import * as bodyParser from 'body-parser';
import { AppMiddlewares } from './../../core/middlewares/AppMiddleware';
import { appLoggerMiddleware } from './../../core/middlewares/AppLoggerMiddleware';
import { appAuthenticateMiddleware } from './../../core/middlewares/AppAuthenticateMiddleware';
import { userRouteValidatorMiddleware } from './../../core/middlewares/validation/request/UserRouteValidatorMiddleware';

export const middlewares: AppMiddlewares= {
    _: [
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json({ strict: false}),
        appLoggerMiddleware.log
    ],
    '/user/:name?': {
        get: [
            userRouteValidatorMiddleware.get,
            //appAuthenticateMiddleware.check
        ],
        post: [
            userRouteValidatorMiddleware.post
        ]
    }
};

export default middlewares;
