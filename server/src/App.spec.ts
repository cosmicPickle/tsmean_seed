import { Response, Request, Express } from 'express';
import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { App } from './App';
import { middlewares } from './configuration/middlewares/middlewaresConfig'
import { resourceConfig } from './configuration/routes/resourceConfig';

describe('Server: App', () => {

    it('should mount global middlewares', () => {
        let app = new App();
        let expressUseStub = sinon.stub(app.express, 'use');
        
        app.init();
        
        (app.express.use as SinonStub).restore();
        sinon.assert.calledWith(expressUseStub as SinonStub, middlewares._);
    });

    it('should mount all routes', () => {
        let app = new App();
        let stubs = [];
        resourceConfig.forEach((route, index) => {
            stubs[index] = sinon.stub(route, 'mountRoutes');
        });

        app.init();

        resourceConfig.forEach((route, index) => {
            (route.mountRoutes as SinonStub).restore();
            sinon.assert.called(stubs[index]);
        });
    })
})