import { Response, Request, Express, NextFunction } from 'express';
import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { mongoose } from './../core/models/db/mongo/connection';
import { appLoggerMiddleware } from './AppLoggerMiddleware'
import { logger } from '../core/lib/AppLogger';
import { LoggerInstance } from 'winston';

describe('Middleware: AppLoggerMiddleware', () => {


    describe('log() method', () => {

        it('should log the current request method, path and params', () => {

            let req: Partial<Request> = {
                method: 'get',
                params: {
                    test: 123
                }
            };
            let res: Partial<Response> = {};
            let next: NextFunction = sinon.stub();

            let consoleLogStub = sinon.stub(logger as LoggerInstance, 'debug');

            appLoggerMiddleware.log(<Request>req, <Response>res, next);

            (logger.debug as SinonStub).restore();

            sinon.assert.calledWith(consoleLogStub, `Request ${req.method.toUpperCase()} ${req.path}: ${JSON.stringify(req.params)}`);
            sinon.assert.called(next as SinonStub);
        })
    })
})