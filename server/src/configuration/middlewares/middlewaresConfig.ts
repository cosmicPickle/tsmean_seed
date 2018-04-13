import * as bodyParser from 'body-parser';
import { AppMiddlewares } from './../../core/middlewares/AppMiddleware';
import { appLoggerMiddleware } from './../../middlewares/AppLoggerMiddleware';
import { appAuthenticateMiddleware } from './../../middlewares/AppAuthenticateMiddleware';

export const middlewares: AppMiddlewares= {
    _: [
        bodyParser.urlencoded({ extended: false }),
        bodyParser.json()
    ],
    '/user/:name?': {
        get: [
            appLoggerMiddleware.log, 
            //appAuthenticateMiddleware.check
        ]
    }
};

export default middlewares;
