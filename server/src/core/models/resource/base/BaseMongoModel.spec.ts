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
    bar: string,
    rel: ITestRelMongoModel
}

interface ITestRelMongoModel extends IBaseMongoModel {
    baz: string
}

class TestMongoModel extends BaseMongoModel<ITestMongoModel> {
    name = 'testCollection';
    checkRelationsValidity = false;
    schemaValidation = {
        $jsonSchema: {
            bsonType: "object",
            required: ['foo'],
            properties: {
                foo: {
                    bsonType: "number"
                },
                bar: {
                    bsonType: "string"
                }
            }
        }
    }
}



let bmm = new TestMongoModel();


describe('Core: BaseMongoModel', () => {

    before(async () => {
        await mongo.connect({
            testMode: true
        });

        await mongo.setup({
            createValidation: true,
            createIndexes: true
        });
    });
     
    after(() => {
        mongo.close();
    })
     
    /**
     * PUBLIC METHODS
     */

     describe('Method: create<B extends AppBaseBody>(entity: B): Promise<types.InsertOneWriteOpResult<T>>', () => {

        

        it('should throw exception if collection is undefined.', async () => {
            let promise = bmm.create({
                foo: 123
            });
            await chai.expect(promise).to.be.rejectedWith(`Collection is not set.`);
        });


        it('should throw if entity is empty', async () => {
            bmm.get();

            let promise = bmm.create({});
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is an array', async () => {
            bmm.get();

            let promise = bmm.create([]);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is null', async () => {
            bmm.get();

            let promise = bmm.create(null);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is undefined', async () => {
            bmm.get();

            let promise = bmm.create(undefined);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is a number', async () => {
            bmm.get();

            let promise = bmm.create(123);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is a boolean', async () => {
            bmm.get();

            let promise = bmm.create(true);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });


        it('should throw if entity doesn\'t have foo set.', async () => {
            bmm.get();
            let promise = bmm.create({ bar: 123 });
            await chai.expect(promise).to.be.rejectedWith('Document failed validation');
        });

        it('should throw if entity doesn\'t have foo is string.', async () => {
            bmm.get();
            let promise = bmm.create({ foo: "1234", bar: "123" });
            await chai.expect(promise).to.be.rejectedWith('Document failed validation');
        });

        describe('read relationship validation tests', () => {

            beforeEach(() => {
                bmm.checkRelationsValidity = true;
                bmm.relations = {
                    rel: new types.BaseMongoRelation<ITestRelMongoModel>({
                        from: 'testRelCollection',
                        projections: {
                            default: { },
                            extended: { }
                        },
                    })
                };
            })
            
            it('should throw "Malformed relations configuration." if no relations', async () => {
                bmm.checkRelationsValidity = true;
                bmm.relations = {}

                bmm.get();
            
                let promise = bmm.create({ foo: "1234", bar: "123" });
                await chai.expect(promise).to.be.rejectedWith('Malformed relations configuration.');
            });

            it('should not perform validity check if checkRelationsValidity is false', async () => {
                bmm.checkRelationsValidity = false;

                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations");
            
                await bmm.create({
                    foo: 123
                });
                sinon.assert.notCalled(_validateRelationsStub as SinonStub);
                _validateRelationsStub.restore();
            });


            //TODO: test to check if an error is thrown when bmm.relations is in wrong format


            it('should throw "Invalid relation" if _validateRelations fails', async () => {
                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations").returns(false);
                
                let promise = bmm.create({ foo: 1234, bar: "123", rel: "123323" });
                await chai.expect(promise).to.be.rejectedWith('Invalid relation');
            })
        });

     })
});