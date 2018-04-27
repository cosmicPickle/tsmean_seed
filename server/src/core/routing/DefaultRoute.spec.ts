import { DefaultRoute } from './DefaultRoute';
import { Response, Request, Express } from 'express';

import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { mongoose } from '../models/db/mongo/connection';
import { appInvalidRouteError } from './../../configuration/errors/errorsConfig';

const dfr = new DefaultRoute();

describe('class DefaultRoute', () => {


    it('should return AppInvalidRouteError', async () => {

        const req: Partial<Request> = {}
        const res: Partial<Response> = {
            json: sinon.stub()
        }

        await dfr.get(<Request>req, <Response>res);
        
        sinon.assert.calledWith(res.json as SinonStub, (appInvalidRouteError.get()))
    })
});