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

    describe('Method: public create<B extends AppBaseBody>(entity: B): Promise<types.InsertOneWriteOpResult<T>>', () => {

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

        it('should throw if entity has foo of type string.', async () => {
            bmm.get();
            let promise = bmm.create({ foo: "1234", bar: "123" });
            await chai.expect(promise).to.be.rejectedWith('Document failed validation');
        });

        describe('create relationship validation tests', () => {

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

            it('should throw "Invalid relation" if _validateRelations fails', async () => {
                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations").returns(false);
                
                let promise = bmm.create({ foo: 1234, bar: "123", rel: "5ad756275ff18a376e71e071" });
                _validateRelationsStub.restore();

                await chai.expect(promise).to.be.rejectedWith('Invalid relation');
            });

            it('should insert new entry if _validateRelations returns a valid relation', async () => {
                let body = { foo: 1234, bar: "123", rel: "5ad756275ff18a376e71e071" };
                bmm.checkRelationsValidity = true;

                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations").returns({ rel: body.rel});

                await bmm.create(body);
                sinon.assert.calledOnce(_validateRelationsStub);

                let result = await bmm.get().findOne(body)
                chai.expect(result).to.not.be.null;
                _validateRelationsStub.restore();

                bmm.get().deleteOne(body);
            });

            it('should insert new entry if _validateRelations returns an empty object.', async () => {
                let body = { foo: 1234, bar: "123", rel: "5ad756275ff18a376e71e071" };
                bmm.checkRelationsValidity = true;

                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations").returns({});

                await bmm.create(body);
                sinon.assert.calledOnce(_validateRelationsStub);

                let result = await bmm.get().findOne(body)
                chai.expect(result).to.not.be.null;
                _validateRelationsStub.restore();

                bmm.get().deleteOne(body);
            });

            it('should not perform validity check if checkRelationsValidity is false and insert new entry', async () => {
                let body = {
                    foo: 123
                };
                bmm.checkRelationsValidity = false;

                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations");
            
                await bmm.create(body);
                sinon.assert.notCalled(_validateRelationsStub as SinonStub);
                _validateRelationsStub.restore();

                let result = await bmm.get().findOne(body)
                chai.expect(result).to.not.be.null;

                bmm.get().deleteOne(body);
            });      
        });

        describe('create onPreSave tests', () => {

            it('should throw "Pre-save operation failed." if onPreSave function throws.', async () => {
                let body = {
                    foo: 123
                };
                (bmm as any).onPreSave = sinon.stub().throws("Not enough mana");

                bmm.checkRelationsValidity = false;
                bmm.get();

                let promise = bmm.create(body);
                await chai.expect(promise).to.be.rejectedWith('Pre-save operation failed.');
                (bmm as any).onPreSave = null;
            });

            it('should throw "Pre-save operation failed." if onPreSave function rejects.', async () => {
                let body = {
                    foo: 123
                };
                (bmm as any).onPreSave = sinon.stub().rejects();

                bmm.checkRelationsValidity = false;
                bmm.get();

                let promise = bmm.create(body);
                await chai.expect(promise).to.be.rejectedWith('Pre-save operation failed.');
                (bmm as any).onPreSave = null;
            });

            it('should throw "Pre-save operation failed." if onPreSave function a falsy value. ', async () => {
                let body = {
                    foo: 123
                };
                (bmm as any).onPreSave = sinon.stub().returns(false);

                bmm.checkRelationsValidity = false;
                bmm.get();

                let promise = bmm.create(body);
                await chai.expect(promise).to.be.rejectedWith('Pre-save operation failed.');
                (bmm as any).onPreSave = null;
            });

            it('should call onPreSave and insert the entry if onPreSave returns a truthy value', async () => {
                let body = {
                    foo: 123
                };
                bmm.checkRelationsValidity = false;
                (bmm as any).onPreSave = sinon.stub().resolves(true);

                bmm.get();
            
                await bmm.create(body);
                sinon.assert.called((bmm as any).onPreSave as SinonStub);
                (bmm as any).onPreSave = null;

                let result = await bmm.get().findOne(body)
                chai.expect(result).to.not.be.null;

                bmm.get().deleteOne(body);
            });  
        });
    });

    describe(`Method: private async _validateRelations<B extends AppBaseBody>(entity: B): 
              Promise<boolean | { [key:string] : mongodb.ObjectId | mongodb.ObjectId[] }>`, () => {

        let body: any = {};
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
            body = {
                foo: 123,
                rel: "5ad756275ff18a376e71e071"
            }

        })

        it("should return {} if no relations are set on bmm", () => {
            bmm.relations = {};     
            chai.expect(Object.keys((bmm as any)._validateRelations(body)).length).to.eql(0);
        })

        it("should throw 'Entity empty' if entity is empty", () => {
            body = {};     
            chai.expect((bmm as any)._validateRelations(body)).rejectedWith("Entity empty");
        })

        describe('_validateRelations rel.isArray=true tests', () => {

            beforeEach(() => {
                bmm.relations.rel.isArray = true;
            });

            it(`should return false if body['rel'] is not an array`,async () => {
                chai.expect(await (bmm as any)._validateRelations(body)).to.be.false;
            })

            it(`should throw 'Invalid relation ObjectId/s' if the bmm.relations.rel.foreignField is not set and body.rel are not valid ObjectIds`, async () => {

                body.rel = ['1', 2, 3];
                await chai.expect((bmm as any)._validateRelations(body)).to.be.rejectedWith('Invalid relation ObjectId/s');
            });

            it(`should not throw 'Invalid relation ObjectId/s' if the bmm.relations.rel.foreignField is set`, async () => {

                body.rel = ['1', 2, 3];
                bmm.relations.rel.foreignField = 'baz';
                let mongoDbStub = sinon.stub(mongo, 'db').returns({
                    collection: sinon.stub().returns({
                        find: sinon.stub().returns({
                            toArray: sinon.stub().returns([
                                '1', 2
                            ])
                        })
                    })
                });

                await chai.expect((bmm as any)._validateRelations(body)).to.not.be.rejectedWith('Invalid relation ObjectId/s');
                (mongoDbStub as SinonStub).restore();
                bmm.relations.rel.foreignField = undefined;
            });

            it('should return false if the number of returned matched relations is less than body.rel.length', async () => {
                body.rel = ['5ad756275ff18a376e71e071', '5ad756275ff18a376e71e072'];

                let mongoDbStub = sinon.stub(mongo, 'db').returns({
                    collection: sinon.stub().returns({
                        find: sinon.stub().returns({
                            toArray: sinon.stub().returns([
                                '5ad756275ff18a376e71e071'
                            ])
                        })
                    })
                });

                chai.expect(await (bmm as any)._validateRelations(body)).to.be.false;
                (mongoDbStub as SinonStub).restore();
            });

            it('should otherwise return an object with key rel, where rel is an array with length equal to body.rel.length', async () => {
                body.rel = ['5ad756275ff18a376e71e071', '5ad756275ff18a376e71e072'];

                let mongoDbStub = sinon.stub(mongo, 'db').returns({
                    collection: sinon.stub().returns({
                        find: sinon.stub().returns({
                            toArray: sinon.stub().returns([
                                '5ad756275ff18a376e71e071',
                                '5ad756275ff18a376e71e072'
                            ])
                        })
                    })
                });
                
                let res = await (bmm as any)._validateRelations(body);
                chai.expect(res).to.haveOwnProperty('rel');
                chai.expect(res.rel.length).to.eql(body.rel.length);
                (mongoDbStub as SinonStub).restore();
            });
        });

        describe('_validateRelations rel.isArray=false tests', () => {

            beforeEach(() => {
                bmm.relations.rel.isArray = false;
            });


            it(`should return false if body['rel'] is an array`,async () => {
                body.rel = ["5ad756275ff18a376e71e071"];
                chai.expect(await (bmm as any)._validateRelations(body)).to.be.false;
            })

            it(`should throw 'Invalid relation ObjectId/s' if the bmm.relations.rel.foreignField is not set and body.rel is not a valid ObjectId`, async () => {
                body.rel = '1';
                await chai.expect((bmm as any)._validateRelations(body)).to.be.rejectedWith('Invalid relation ObjectId/s');
            });

            it(`should not throw 'Invalid relation ObjectId/s' if the bmm.relations.rel.foreignField is set`, async () => {

                body.rel = '1';
                bmm.relations.rel.foreignField = 'baz';
                let mongoDbStub = sinon.stub(mongo, 'db').returns({
                    collection: sinon.stub().returns({
                        findOne: sinon.stub().returns({
                            '_id': '5ad756275ff18a376e71e071',
                            'baz': 123
                        })
                    })
                });

                await chai.expect((bmm as any)._validateRelations(body)).to.not.be.rejectedWith('Invalid relation ObjectId/s');
                (mongoDbStub as SinonStub).restore();
            });

            it('should return false if there are no matched relations', async () => {
                body.rel = '5ad756275ff18a376e71e071';

                let mongoDbStub = sinon.stub(mongo, 'db').returns({
                    collection: sinon.stub().returns({
                        findOne: sinon.stub().returns(null)
                    })
                });

                chai.expect(await (bmm as any)._validateRelations(body)).to.be.false;
                (mongoDbStub as SinonStub).restore();
            });

            it('should otherwise return an object with key rel', async () => {
                body.rel = '5ad756275ff18a376e71e071';

                let mongoDbStub = sinon.stub(mongo, 'db').returns({
                    collection: sinon.stub().returns({
                        findOne: sinon.stub().returns({
                            '_id': '5ad756275ff18a376e71e071',
                            'baz': 123
                        })
                    })
                });
                
                let res = await (bmm as any)._validateRelations(body);
                chai.expect(res).to.haveOwnProperty('rel');
                mongoDbStub.restore();
            });
        });  
        
    });

    describe('Method: public update<B extends AppBaseBody>(id: string | number | mongodb.ObjectId, entity: B, by: keyof T = this.lookupField): Promise<mongodb.UpdateWriteOpResult>', () => {

        let updateObjectId = null;
        before(async () => {
            bmm.get();
            bmm.checkRelationsValidity = false;

            let result = await bmm.get().insertOne({
                foo: 123
            });

            updateObjectId = result.insertedId;
        })

        after(async () => {
            await bmm.get().deleteOne({
                _id: updateObjectId
            })
        })

        it('should throw exception if collection is undefined.', async () => {
            (bmm as any).collection = undefined;

            let promise = bmm.update(updateObjectId, {
                foo: 123
            });
            await chai.expect(promise).to.be.rejectedWith(`Collection is not set.`);
        });


        it('should throw if entity is empty', async () => {
            bmm.get();

            let promise = bmm.update(updateObjectId, {});
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is an array', async () => {
            bmm.get();

            let promise = bmm.update(updateObjectId, []);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is null', async () => {
            bmm.get();

            let promise = bmm.update(updateObjectId, null);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is undefined', async () => {
            bmm.get();

            let promise = bmm.update(updateObjectId, undefined);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is a number', async () => {
            bmm.get();

            let promise = bmm.update(updateObjectId, 123);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });

        it('should throw if entity is a boolean', async () => {
            bmm.get();

            let promise = bmm.update(updateObjectId, true);
            await chai.expect(promise).to.be.rejectedWith('Entity empty');
        });


        it('should *not* throw if entity doesn\'t have foo set as we do a partial update and schema validation should pass.', async () => {
            bmm.get();
            let promise = bmm.update(updateObjectId, { bar: "123" });
            await chai.expect(promise).to.not.be.rejectedWith('Document failed validation');
        });

        it('should throw if id is null', async () => {
            bmm.get();
            await chai.expect((bmm as any).update(null, { bar: "123" })).to.be.rejectedWith('Id not set or invalid');
        })

        it('should throw if id is undefined', async () => {
            bmm.get();
            await chai.expect((bmm as any).update(undefined, { bar: "123" })).to.be.rejectedWith('Id not set or invalid');
        })

        it('should throw if id is Object', async () => {
            bmm.get();
            await chai.expect((bmm as any).update({ a: 123}, { bar: "123" })).to.be.rejectedWith('Id not set or invalid');
        })

        it('should throw if id is Array', async () => {
            bmm.get();
            await chai.expect((bmm as any).update([1, 22222, 'str'], { bar: "123" })).to.be.rejectedWith('Id not set or invalid');
        })

        describe('create relationship validation tests', () => {

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
            
                let promise = bmm.update(updateObjectId, { foo: "1234", bar: "123" });
                await chai.expect(promise).to.be.rejectedWith('Malformed relations configuration.');
            });

            it('should throw "Invalid relation" if _validateRelations fails', async () => {
                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations").returns(false);
                
                let promise = bmm.update(updateObjectId, { foo: 1234, bar: "123", rel: "5ad756275ff18a376e71e071" });
                _validateRelationsStub.restore();

                await chai.expect(promise).to.be.rejectedWith('Invalid relation');
            });

            it('should update the entry if _validateRelations returns a valid relation', async () => {
                let body = { foo: 10000, bar: "123", rel: "5ad756275ff18a376e71e071" };
                bmm.checkRelationsValidity = true;

                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations").returns({ rel: body.rel});

                let result = await bmm.update(updateObjectId, body);
                sinon.assert.calledOnce(_validateRelationsStub);
                chai.expect(result.modifiedCount).to.eql(1);

                _validateRelationsStub.restore();

            });

            it('should update the entry if _validateRelations returns an empty object.', async () => {
                let body = { foo: 1234, bar: "123", rel: "5ad756275ff18a376e71e071" };
                bmm.checkRelationsValidity = true;

                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations").returns({});

                let result = await bmm.update(updateObjectId, body);
                sinon.assert.calledOnce(_validateRelationsStub);
                chai.expect(result.modifiedCount).to.eql(1);

                _validateRelationsStub.restore();
            });

            it('should not perform validity check if checkRelationsValidity is false and insert new entry', async () => {
                let body = {
                    foo: 1
                };
                bmm.checkRelationsValidity = false;

                bmm.get();
                let _validateRelationsStub = sinon.stub(bmm as any, "_validateRelations");
            
                let result = await bmm.update(updateObjectId, body);
                sinon.assert.notCalled(_validateRelationsStub as SinonStub);
                chai.expect(result.modifiedCount).to.eql(1);

                _validateRelationsStub.restore();
            });      
        });

        describe('create onPreSave tests', () => {

            it('should throw "Pre-save operation failed." if onPreSave function throws.', async () => {
                let body = {
                    foo: 123
                };
                (bmm as any).onPreSave = sinon.stub().throws("Not enough mana");

                bmm.checkRelationsValidity = false;
                bmm.get();

                let promise = bmm.update(updateObjectId, body);
                await chai.expect(promise).to.be.rejectedWith('Pre-save operation failed.');
                (bmm as any).onPreSave = null;
            });

            it('should throw "Pre-save operation failed." if onPreSave function rejects.', async () => {
                let body = {
                    foo: 123
                };
                (bmm as any).onPreSave = sinon.stub().rejects();

                bmm.checkRelationsValidity = false;
                bmm.get();

                let promise = bmm.update(updateObjectId, body);
                await chai.expect(promise).to.be.rejectedWith('Pre-save operation failed.');
                (bmm as any).onPreSave = null;
            });

            it('should throw "Pre-save operation failed." if onPreSave function a falsy value. ', async () => {
                let body = {
                    foo: 123
                };
                (bmm as any).onPreSave = sinon.stub().returns(false);

                bmm.checkRelationsValidity = false;
                bmm.get();

                let promise = bmm.update(updateObjectId, body);
                await chai.expect(promise).to.be.rejectedWith('Pre-save operation failed.');
                (bmm as any).onPreSave = null;
            });

            it('should call onPreSave and insert the entry if onPreSave returns a truthy value', async () => {
                let body = {
                    foo: 123
                };
                bmm.checkRelationsValidity = false;
                (bmm as any).onPreSave = sinon.stub().resolves(true);

                bmm.get();
            
                let result = await bmm.update(updateObjectId, body);
                chai.expect(result.modifiedCount).to.eql(1);
                sinon.assert.called((bmm as any).onPreSave as SinonStub);

                (bmm as any).onPreSave = null;
            });  
        });
    });
});