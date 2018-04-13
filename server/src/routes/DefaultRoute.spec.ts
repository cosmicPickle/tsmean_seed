import { DefaultRoute } from './DefaultRoute';
import { Response, Request, Express } from 'express';

import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { after } from 'mocha';
import { mongoose } from '../core/models/db/mongo/connection';
import { AppInvalidRouteError } from '../errors/AppInvalidRouteError';

const dfr = new DefaultRoute();

describe('class DefaultRoute', () => {

    after(function(done){
        mongoose.connection.close();
        done();
    })

    it('should return AppInvalidRouteError', async () => {

        const req: Partial<Request> = {}
        const res: Partial<Response> = {
            json: sinon.stub()
        }

        await dfr.get(<Request>req, <Response>res);
        
        sinon.assert.calledWith(res.json as SinonStub, (new AppInvalidRouteError()).get())
    })
});