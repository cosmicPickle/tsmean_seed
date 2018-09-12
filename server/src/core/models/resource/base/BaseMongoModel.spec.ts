import { Response, Request, Express, NextFunction } from 'express';
import * as sinon from 'sinon';
import { SinonStub } from 'sinon';
import * as chai from 'chai';
import * as asyncChai from 'chai-as-promised';
chai.use(asyncChai);

import * as mongodb from 'mongodb';
import { mongo } from './../../../lib/AppMongoDriver';
import { BaseMongoModel } from './BaseMongoModel';
import { IBaseMongoModel } from './IBaseMongoModel';
import * as types from './BaseMongoTypes';
import { AppBaseBody } from './BaseValidationSchemaTypes';

/**
 * Tests
 * 
 * Public methods:
 * =================================
 * read
 * ---------------------------------
 * readOne
 * ---------------------------------
 * create
 * ---------------------------------
 * update
 * ---------------------------------
 * delete
 * ---------------------------------
 * restore
 * ---------------------------------
 * 
 * 
 * Private methods
 * ==================================
 * readSimple
 * ----------------------------------
 * readOneSimple
 * ----------------------------------
 * readAggregate
 * ----------------------------------
 * readOneAggregate
 * ----------------------------------
 *
 *
 * * Public Helper methods:
 * ============================
 * getFind
 *  invalid values for this.filters
 *  with soft delete enabled
 *  with zero inputs matching
 *  with one filter matching but empty
 * ----------------------------
 * getSort
 *  with empty sortQuery
 *  with number sort query
 * -----------------------------
 * getPagination
 *  with empty pagination
 *  with results per page == 0, -1, NaN
 * -----------------------------
 * getLookup
 *  with no relations
 *  with relations being an array
 *  with relations being a number
 *  with rel.foreignField unset
 *  with key being a number and rel.as unset
 *  with rel.as being a number
 *  with re.isArray true
 * ----------------------------------
 * getProjection
 * ----------------------------------
 * 
 * 
 * Private Helper Methods methods:
 * =======================
 * _parseFilter
 *  with typeof filter Array
 * -------------------------
 * _parseObjectId
 * -------------------------
 * _validateRelations
 * 
 */


interface ITestMongoModel extends IBaseMongoModel {
    foo: number,
    rel: ITestRelMongoModel
}

interface ITestRelMongoModel extends IBaseMongoModel {
    bar: string
}

let bmm = new BaseMongoModel<ITestMongoModel>();


describe('Core: BaseMongoModel', () => {

    before(async () => {
        await mongo.connect({
            testMode: true
        });
    });
     
    after(() => {
        mongo.close();
    })
     
    /**
     * PUBLIC METHODS
     */

     describe('Method: create<B extends AppBaseBody>(entity: B): Promise<types.InsertOneWriteOpResult<T>>', () => {

        let body: AppBaseBody = {
            foo: 123
        };
        let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations");
        

        it('should throw exception if collection is undefined.', async () => {
            let promise = bmm.create(body);
            await chai.expect(promise).to.be.rejectedWith(`Collection is not set.`);
        });


        it('should throw if entity is empty', async() => {
            (bmm as any).collection = mongo.db().collection('testCollection');

            let promise = bmm.create({});
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should not perform validity check if no relations', async () => {
            (bmm as any).collection = mongo.db().collection('testCollection');
            
            await bmm.create(body);
            sinon.assert.notCalled(_validateRelationsStub as SinonStub);
            _validateRelationsStub.reset();
        });

     })
});