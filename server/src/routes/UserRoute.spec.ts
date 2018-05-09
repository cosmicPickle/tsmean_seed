import { userRoute } from './UserRoute';
import { Response, Request, Express, Router } from 'express';
import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';

import { mongoose } from './../configuration/db/mongo';

import { User } from '../core/models/resource/user/UserDocument';
import { IUser } from '../core/models/resource/user/types';
import { userRouteValidatorMiddleware } from './../core/middlewares/validation/request/UserRouteValidatorMiddleware';

import { Group } from '../core/models/resource/group/GroupDocument';
import { IGroup } from '../core/models/resource/group/types';

import { appUnknownUserError, appMongoError } from './../configuration/errors/errorsConfig';

import { appLoggerMiddleware } from '../core/middlewares/AppLoggerMiddleware';
import { appAuthenticateMiddleware } from '../core/middlewares/AppAuthenticateMiddleware';

import { Model } from 'mongoose';


describe('class UserRoute', () => {

    it('should mount the proper middlewares', () => {
        let router = Router();
        let routerGetStub = sinon.stub(router, 'get');
        let path = '/user/:name?';
        let middlewares = [
            userRouteValidatorMiddleware.get,
            //appAuthenticateMiddleware.check
        ];
        
        userRoute.mountMiddlewares(router);

        (router.get as SinonStub).restore();
        sinon.assert.calledWith(routerGetStub, path, middlewares); 
    })

    it('should mount this.get, this.post, this.put and this.delete methods for the current path', () => {
        let router = Router();
        let routerGetStub = sinon.stub(router, 'get');
        let path = '/user/:name?';
        
        userRoute.mount(router);

        (router.get as SinonStub).restore();
        sinon.assert.calledWith(routerGetStub, path, userRoute.get); 
    })

    describe('get()', () => {

        it('should return Mongo Error if Mongoose throws an exception', async () => {
            let req: Partial<Request> = {
                params: {}
            };
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let findOneStub: SinonStub;

            try {
                findOneStub = sinon.stub(User, 'findOne').returns({
                    populate: sinon.stub().returns({
                        exec: sinon.stub().rejects(new Error('This is a Mongoose failure'))
                    })
                } as Partial<Model<IUser>>);

                await userRoute.get(<Request>req, <Response>res);
            } catch(e) { 
                console.log(e);
            }

            (User.findOne as SinonStub).restore();

            let e = appMongoError.get();
            e.message = 'mongoose_error';
            e.payload = {
                debug: 'This is a Mongoose failure'
            }
            
            sinon.assert.calledWith(res.json as sinon.SinonStub, e);
        })

        it('should return UnknownUser Error on empty name', async () => {

            let req: Partial<Request> = {
                params: {}
            };
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let findOneStub = sinon.stub(User, 'findOne').returns({
                populate: sinon.stub().returns({
                    exec: sinon.stub().resolves(null)
                })
            } as Partial<Model<IUser>>);

            await userRoute.get(<Request>req, <Response>res).then(() => {
                findOneStub.restore();
                sinon.assert.calledWith(res.json as sinon.SinonStub,appUnknownUserError.get())
            });

        });

        it('should return UnknownUser Error on 123 name',async () => {

            let req: Partial<Request> = {
                params: {
                    name: 123
                }
            };
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let findOneStub = sinon.stub(User, 'findOne').returns({
                populate: sinon.stub().returns({
                    exec: sinon.stub().resolves(null)
                })
            } as Partial<Model<IUser>>);

            await userRoute.get(<Request>req, <Response>res).then(() => {
                findOneStub.restore();
                sinon.assert.calledWith(res.json as sinon.SinonStub, appUnknownUserError.get())
            });

        });

        it('should return UnknownUser Error on 123\' name', async () => {

            let req: Partial<Request> = {
                params: {
                    name: "123'"
                }
            };
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let findOneStub = sinon.stub(User, 'findOne').returns({
                populate: sinon.stub().returns({
                    exec: sinon.stub().resolves(null)
                })
            } as Partial<Model<IUser>>);

            await userRoute.get(<Request>req, <Response>res).then(() => {
                findOneStub.restore();
                sinon.assert.calledWith(res.json as sinon.SinonStub, appUnknownUserError.get())
                
            });

        });

        it('should return the name and group when selecting a valid user', async () => {

            let req: Partial<Request> = {
                params: {
                    name: 'cosmic1'
                }
            };

            let res: Partial<Response> = {
                json: sinon.stub()
            };

            const user = new User();
            user.username = req.params.name;
            user.password = '123qwe123';
            user.group = new Group();
            user.group.name = "newbie";
            user.group.allowedRoutes = ['/test/'];
            user.group.allowedServices = [{
                method: 'get',
                path: `/group/${user.group.name}`
            }];
            

            let findOneStub = sinon.stub(User, 'findOne').returns({
                populate: sinon.stub().returns({
                    exec: sinon.stub().resolves(user)
                })
            } as Partial<Model<IUser>>);

            await userRoute.get(<Request>req, <Response>res).then(() => {
                (User.findOne as SinonStub).restore();
                sinon.assert.calledWith(res.json as sinon.SinonStub, {
                    handshake: 'Hi, ' + req.params.name,
                    group: user.group.name,
                    status: 'ok'
                })
            });
        });
    })
})
