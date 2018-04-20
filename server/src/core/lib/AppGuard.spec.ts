import 'mocha';
import { expect } from 'chai';
import { appGuard } from './AppGuard';
import { AppServicePath } from '../models/AppServicePath';
import { Request } from 'express';
import * as sinon from 'sinon';
import { Model } from 'mongoose';
import { IUser, User } from '../models/db/mongo/UserDocument';
import { SinonStub } from 'sinon';

describe('Library: AppGuard', () => {

    describe('_checkServices', () => {
        it('should return false if no paths are provided', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = 'GET';
            let controlUrl = '/user/cosmic'
            let services: AppServicePath[] = [];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.false;
        });

        it('should return false if incorrect controlMethod is provided', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = 'INVALID';
            let controlUrl = '/user/cosmic';
            let services: AppServicePath[] = [{
                method: 'get',
                path: '/user/cosmic'
            }];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.false;
        });

        it('should return false if no controlMethod is provided', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = '';
            let controlUrl = '/user/cosmic';
            let services: AppServicePath[] = [{
                method: 'get',
                path: '/user/cosmic'
            }];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.false;
        });

        it('should return false if there is no path matched', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = 'GET';
            let controlUrl = '/user/cosmic';
            let services: AppServicePath[] = [{
                method: 'post',
                path: '/group/'
            }];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.false;
        });

        it('should return false if there is no path provided', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = 'GET';
            let controlUrl = '';
            let services: AppServicePath[] = [{
                method: 'post',
                path: '/group/'
            }];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.false;
        });

        it('should return false if there is no services, controlMethod and controlUrl are provided', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = '';
            let controlUrl = '';
            let services: AppServicePath[] = [];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.false;
        });

        it('should return true if there is a direct match', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = 'GET';
            let controlUrl = '/user/cosmic';
            let services: AppServicePath[] = [{
                method: 'get',
                path: '/user/cosmic'
            }];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.true;
        });

        it('should return true if there is a path match', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = 'GET';
            let controlUrl = '/user/cosmic';
            let services: AppServicePath[] = [{
                method: 'get',
                path: '/user/:name?'
            }];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.true;
        });

        it('should return true if there are two or more matches', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = 'GET';
            let controlUrl = '/user/cosmic';
            let services: AppServicePath[] = [{
                method: 'get',
                path: '/user/:name?'
            },{
                method: 'get',
                path: '/user/cosmic'
            }];
            
            let result = anyAppGuard._checkServices(services, controlMethod, controlUrl);
            expect(result).to.be.true;
        });
    });

    describe('_checkRoutes', () => {
        it('should return false if no paths are provided', () => {
            let anyAppGuard = appGuard as any;
            let controlUrl = '/user/cosmic'
            let services: string[] = [];
            
            let result = anyAppGuard._checkRoutes(services, controlUrl);
            expect(result).to.be.false;
        });

        it('should return false if there is no path matched', () => {
            let anyAppGuard = appGuard as any;
            let controlUrl = '/profile/edit';
            let services: string[] = ['/profile/view', '/home'];
            
            let result = anyAppGuard._checkRoutes(services, controlUrl);
            expect(result).to.be.false;
        });

        it('should return false if there is no controlUrl provided', () => {
            let anyAppGuard = appGuard as any;
            let controlMethod = 'GET';
            let controlUrl = '';
            let services: string[] = ['/profile/view', '/home'];
            
            let result = anyAppGuard._checkRoutes(services, controlUrl);
            expect(result).to.be.false;
        });

        it('should return false if there is no services and controlUrl are provided', () => {
            let anyAppGuard = appGuard as any;
            let controlUrl = '';
            let services: string[] = [];
            
            let result = anyAppGuard._checkRoutes(services, controlUrl);
            expect(result).to.be.false;
        });

        it('should return true if there is a direct match', () => {
            let anyAppGuard = appGuard as any;
            let controlUrl = '/profile/view';
            let services: string[] = ['/profile/view'];
            
            let result = anyAppGuard._checkRoutes(services, controlUrl);
            expect(result).to.be.true;
        });

        it('should return true if there is a path match', () => {
            let anyAppGuard = appGuard as any;
            let controlUrl = '/profile/view';
            let services: string[] = ['/profile/:action?'];
            
            let result = anyAppGuard._checkRoutes(services, controlUrl);
            expect(result).to.be.true;
        });

        it('should return true if there are two or more matches', () => {
            let anyAppGuard = appGuard as any;
            let controlUrl = '/profile/view';
            let services: string[] = ['/profile/:action?', '/profile/view'];
            
            let result = anyAppGuard._checkRoutes(services, controlUrl);
            expect(result).to.be.true;
        });
    });

    describe('service()', () => {

        let req: Partial<Request>, execStub, findOneStub: SinonStub;
        beforeEach(() => {
            req = {
                body: {
                    __djwt: {
                        sub: '5ad75dcf9855aa3fb5581464',
                        scopes: [],
                    }
                }
            }
            execStub = sinon.stub();
            findOneStub = sinon.stub(User, 'findOne').returns({
                populate: sinon.stub().returns({
                    exec: execStub
                })
            } as Partial<Model<IUser>>);
        })
        
        after(() => {
            findOneStub.restore();
        })

        it('should return false if the __djwt field is empty', async () => {
            req.body.__djwt = {};
            
            let res = await appGuard.service(req as Request);

            expect(res).to.be.false;
            sinon.assert.notCalled(execStub);
        })

    })
})