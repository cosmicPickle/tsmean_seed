import { Response, Request, Express, NextFunction } from 'express';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import * as chai from 'chai';

import { after } from 'mocha';
import { mongoose } from './../core/db/mongo/connection';
import { appAuthenticateMiddleware } from './AppAuthenticateMiddleware';
import { appAuthorizationError } from '../errors/AppAuthorizationError';
import * as jwt from 'jsonwebtoken';
import config from './../configuration/general'
import { hostname } from 'os';

describe('Middleware: AppAuthenticateMiddleware', () => {

    after(function(done){
        mongoose.connection.close();
        done();
    });

    describe('check() method', () => {

        it('should return authorization error if no token is provided', () => {

            let req: Partial<Request> = {
                method: 'get',
                params: {},
                body: {},
                query: {},
                headers: {}
            };
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let next: NextFunction = sinon.stub();

            appAuthenticateMiddleware.check(<Request>req, <Response>res, next);
            sinon.assert.calledWith(res.json as SinonStub, appAuthorizationError.get());
            sinon.assert.notCalled(next as SinonStub);
        });


        it('should return authorization error if invalid token is provided', () => {

            let req: Partial<Request> = {
                method: 'get',
                headers: {
                    'x-access-token': 'dasdas23423fsdfsfsdf232rfdfsdfsdrf43f3rrgsfdgsdfgasfdgsdfgsdfgdfg'
                },
                body: {},
                query: {},
                params: {}
            };
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let next: NextFunction = sinon.stub();

            appAuthenticateMiddleware.check(<Request>req, <Response>res, next);
            sinon.assert.calledWith(res.json as SinonStub, appAuthorizationError.get());
            sinon.assert.notCalled(next as SinonStub);
        });

        it('should call next() if a valid token is provided', () => {
            let req: Partial<Request> = {
                method: 'get',
                hostname: 'localhost',
                params: {},
                body: {},
                query: {}
            };

            let username = 'cosmic1';
            let payload = {
                scopes: ['get:user:cosmic1']
            }
            req.headers = {
                'x-access-token': jwt.sign(payload, config.jwtSecret, {
                    subject: username,
                    audience: req.hostname,
                    issuer: req.hostname,
                    expiresIn: '1d'
                })
            }
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let next: NextFunction = sinon.stub();

            appAuthenticateMiddleware.check(<Request>req, <Response>res, next);
            sinon.assert.notCalled(res.json as SinonStub);
            sinon.assert.called(next as SinonStub);
            chai.expect(req.body.__djwt.sub).to.eq(username);
            chai.expect(req.body.__djwt.scopes).to.eql(payload.scopes)
        })
    })
})