import * as bodyParser from 'body-parser';
import { AppMiddlewares } from './../../core/middlewares/AppMiddleware';
import { appLoggerMiddleware } from './../../core/middlewares/AppLoggerMiddleware';
import { appAuthenticateMiddleware } from './../../core/middlewares/AppAuthenticateMiddleware';
import { userRouteValidatorMiddleware } from './../../middlewares/validation/request/UserRouteValidatorMiddleware';
import { groupRouteValidatorMiddleware } from '../../middlewares/validation/request/GroupRouteValidatorMiddleware';

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
        ]
    },
    '/group/:name?': {
        get: [
            groupRouteValidatorMiddleware.get
        ]
    }
};

export default middlewares;
