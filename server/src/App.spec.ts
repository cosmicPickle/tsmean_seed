import { Response, Request, Express } from 'express';
import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { mongoose } from './configuration/db/mongo';
import { App } from './App';
import { middlewares } from './configuration/middlewares/middlewaresConfig'
import { routesConfig } from './configuration/routes/routesConfig';

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
        routesConfig.forEach((route, index) => {
            stubs[index] = sinon.stub(route, 'mount');
        });

        app.init();

        routesConfig.forEach((route, index) => {
            (route.mount as SinonStub).restore();
            sinon.assert.called(stubs[index]);
        });
    })
})