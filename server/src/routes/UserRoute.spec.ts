import { userRoute } from './UserRoute';
import { Response, Request, Express, Router } from 'express';
import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { after } from 'mocha';
import { mongoose } from '../core/db/mongo/connection';
import { User } from '../models/db/mongo/UserModel';
import { appUnknownUserError } from '../errors/AppUnknownUserError';
import { appMongoError } from '../errors/AppMongoError';
import { appLoggerMiddleware } from '../middlewares/AppLoggerMiddleware';

describe('class UserRoute', () => {

    after(function(done){
        mongoose.connection.close();
        done();
    });

    it('should mount the proper middlewares', () => {
        let router = Router();
        let routerGetStub = sinon.stub(router, 'get');
        let path = '/user/:name?';
        let middlewares = [appLoggerMiddleware.log]
        
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
            let findOneStub = sinon.stub(User, 'findOne').rejects(new Error('This is a Mongoose failure'));

            await userRoute.get(<Request>req, <Response>res).then(() => {
                (User.findOne as SinonStub).restore();
                sinon.assert.calledWith(res.json as sinon.SinonStub, appMongoError.get())
            });
        })

        it('should return UnknownUser Error on empty name', async () => {

            let req: Partial<Request> = {
                params: {}
            };
            let res: Partial<Response> = {
                json: sinon.stub()
            };
            let findOneStub = sinon.stub(User, 'findOne').resolves(null);

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
            let findOneStub = sinon.stub(User, 'findOne').resolves(null);

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
            let findOneStub = sinon.stub(User, 'findOne').resolves(null);

            await userRoute.get(<Request>req, <Response>res).then(() => {
                findOneStub.restore();
                sinon.assert.calledWith(res.json as sinon.SinonStub, appUnknownUserError.get())
                
            });

        });

        it('should return the name and hasPermission=true when selecting a valid user', async () => {

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
            user.permissions = 0;

            let findOneStub = sinon.stub(User, 'findOne').resolves(user)

            await userRoute.get(<Request>req, <Response>res).then(() => {
                (User.findOne as SinonStub).restore();
                sinon.assert.calledWith(res.json as sinon.SinonStub, {
                    handshake: 'Hi, ' + req.params.name,
                    hasPermission: true,
                    status: 'ok'
                })
            });
        });
    })
})
