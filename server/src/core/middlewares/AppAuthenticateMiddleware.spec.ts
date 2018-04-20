import { Response, Request, Express, NextFunction } from 'express';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import * as chai from 'chai';

import { mongoose } from './../models/db/mongo/connection';
import { appAuthenticateMiddleware } from './AppAuthenticateMiddleware';
import { appAuthorizationError } from '../errors/AppAuthorizationError';
import * as jwt from 'jsonwebtoken';
import config from './../../configuration/general'
import { AppToken, AppTokenPayload, AppTokenOptions } from './../models/AppToken';

describe('Middleware: AppAuthenticateMiddleware', () => {

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

        it('should call next() if a valid token is provided', async () => {
            let username = 'cosmic';
            
            let req: Partial<Request> = {
                method: 'get',
                hostname: 'localhost',
                params: {},
                url: `/user/${username}`,
                body: {},
                query: {}
            };

            let payload: AppTokenPayload = {
                sub: username,
                aud: req.hostname,
                iss: req.hostname,
                scopes: {
                    services: [{
                        method: 'get',
                        path: `/user/${username}`
                    }]
                }
            }
            let options: AppTokenOptions = {
                expiresIn: '1d'
            }
            
            let token = new AppToken(payload, options);
            
            req.headers = {
                'x-access-token': jwt.sign(token.payload, config.jwtSecret, token.options)
            }
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let next: NextFunction = sinon.stub();

            await appAuthenticateMiddleware.check(<Request>req, <Response>res, next);
            sinon.assert.notCalled(res.json as SinonStub);
            sinon.assert.called(next as SinonStub);
            chai.expect(req.body.__djwt.sub).to.eq(username);
            chai.expect(req.body.__djwt.scopes).to.eql(payload.scopes)
        })
    })
})