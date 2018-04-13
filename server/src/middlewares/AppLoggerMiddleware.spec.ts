import { Response, Request, Express, NextFunction } from 'express';
import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { after } from 'mocha';
import { mongoose } from './../core/models/db/mongo/connection';
import { appLoggerMiddleware } from './AppLoggerMiddleware'

describe('Middleware: AppLoggerMiddleware', () => {

    after(function(done){
        mongoose.connection.close();
        done();
    });

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

            let consoleLogStub = sinon.stub(console, 'log');

            appLoggerMiddleware.log(<Request>req, <Response>res, next);

            (console.log as SinonStub).restore();

            sinon.assert.calledWith(consoleLogStub, `Request ${req.method.toUpperCase()} ${req.path}: ${JSON.stringify(req.params)}`);
            sinon.assert.called(next as SinonStub);
        })
    })
})