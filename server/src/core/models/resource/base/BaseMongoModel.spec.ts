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
import { AppBaseBody, AppBaseRequest } from './BaseValidationSchemaTypes';

/**
 * Tests
 * 
 * Public methods:
 * =================================
 * read
 * ---------------------------------
 * readOne
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

class TestRelMongoModel extends BaseMongoModel<ITestRelMongoModel> {
    name = 'testRelCollection';
}

let bmm = new TestMongoModel();
let relModel = new TestRelMongoModel();


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
            });

            after(() => {
                bmm.checkRelationsValidity = false;
                bmm.relations = null
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

            it('should call onPreSave and update the entry if onPreSave returns a truthy value', async () => {
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

            it('should not update the entry if it has a __deleted property & soft delete is enabled', async () => {
                let body = {
                    foo: 14423
                }

                bmm.checkRelationsValidity = false;
                bmm.enableSoftDelete = true;
                let setupResult = await bmm.get().updateOne({ _id: updateObjectId}, {
                    $set: {
                        __deleted: true
                    }
                });
                chai.expect(setupResult.modifiedCount).to.eql(1);

                let result = await bmm.update(updateObjectId, body);
                chai.expect(result.modifiedCount).to.eql(0);
            });

            it('should update the entry if it has a __deleted property & soft delete is disabled', async () => {
                let body = {
                    foo: 14423
                }

                bmm.checkRelationsValidity = false;
                bmm.enableSoftDelete = false;
                let setupResult = await bmm.get().updateOne({ _id: updateObjectId}, {
                    $set: {
                        __deleted: true
                    }
                });

                let result = await bmm.update(updateObjectId, body);
                chai.expect(result.modifiedCount).to.eql(1);
            });
        });
    });

    describe('Method: private _parseObjectId(id: string | number | mongodb.ObjectId ) : string | number | mongodb.ObjectId', () => {

        it('should return the id directly if it is not a valid objectId.', () => {
            let id = 'dddd';

            let result = (bmm as any)._parseObjectId(id);

            chai.expect(result).to.eq(id);
        });

        it('should return the id if it is a valid objectId but the parsed one doesn\'t equal the original', () => {
            let id = 1;

            let isValidSpy = sinon.spy(mongodb.ObjectID, 'isValid');
            let result = (bmm as any)._parseObjectId(id);
            chai.expect(isValidSpy.getCall(0).returnValue).to.be.true;
            chai.expect(result).to.eq(id);            
        });

        it('should return the parsed objectId if id is valid objectId and is equal to the parsed one', () => {
            let id = "5b56dbd107efc974f5f0dcab";

            let result = (bmm as any)._parseObjectId(id);

            chai.expect(result).to.not.be.eq(id);
            chai.expect(result + '').to.be.eq(id);
        });
    });

    describe('Method: public delete<B extends AppBaseBody>(id: string | number | mongodb.ObjectId, by: keyof T = this.lookupField: Promise<mongodb.DeleteWriteOpResultObject> ', () => {

        let deleteObjectId = null;
        beforeEach(async () => {
            bmm.get();
            bmm.checkRelationsValidity = false;

            let result = await bmm.get().insertOne({
                foo: 123
            });

            deleteObjectId = result.insertedId;
        });

        afterEach(async () => {
            await bmm.get().deleteOne({
                _id: deleteObjectId
            })
        });

        it('should throw exception if collection is undefined.', async () => {
            (bmm as any).collection = undefined;

            let promise = bmm.delete(deleteObjectId);
            await chai.expect(promise).to.be.rejectedWith(`Collection is not set.`);
        });

        it('should throw if id is null', async () => {
            bmm.get();
            await chai.expect((bmm as any).delete(null)).to.be.rejectedWith('Id not set or invalid');
        });

        it('should throw if id is undefined', async () => {
            bmm.get();
            await chai.expect((bmm as any).delete(undefined)).to.be.rejectedWith('Id not set or invalid');
        });

        it('should throw if id is Object', async () => {
            bmm.get();
            await chai.expect((bmm as any).delete({ a: 123 })).to.be.rejectedWith('Id not set or invalid');
        });

        it('should throw if id is Array', async () => {
            bmm.get();
            await chai.expect((bmm as any).delete([1, 22222, 'str'])).to.be.rejectedWith('Id not set or invalid');
        });

        it('should return deletedCount=0 if the id is not found', async () => {
            bmm.get();
            let res = await bmm.delete(new mongodb.ObjectID(123));
            chai.expect(res.deletedCount).to.be.eql(0);
        });

        it('should delete the entry from DB if enableSoftDelete is set to false and id is found', async () => {
            bmm.get();
            bmm.enableSoftDelete = false;
            let res = await bmm.delete(deleteObjectId);
            chai.expect(res.deletedCount).to.be.eql(1);

            let check = await bmm.get().findOne({_id: deleteObjectId});
            chai.expect(check).to.be.null;
        });

        it('should return deletedCount=1 & add __deleted property to the entry if enableSoftDelete is set to true and id is found', async () => {
            bmm.get();
            bmm.enableSoftDelete = true;
            let res = await bmm.delete(deleteObjectId);
            chai.expect(res.deletedCount).to.be.eql(1);

            let check = await bmm.get().findOne({_id: deleteObjectId});
            chai.expect((check as any).__deleted).to.be.true;
        });

    });

    describe('Method: public restore(id: string | number | mongodb.ObjectId, by: keyof T = this.lookupField): Promise<mongodb.UpdateWriteOpResult>', () => {

        let restoreObjectId = null;
        before(async () => {
            bmm.get();
            bmm.checkRelationsValidity = false;

            let result = await bmm.get().insertOne({
                foo: 123
            });
            
            restoreObjectId = result.insertedId;
        })

        beforeEach(async () => {
            bmm.enableSoftDelete = true;

            let result = await bmm.get().updateOne({ _id: restoreObjectId}, { $set: {
                __deleted: true
            }});
        });

        after(async () => {
            bmm.enableSoftDelete = false;

            bmm.get().deleteOne({ _id: restoreObjectId});
        })

        it('should throw enableSoftDelete=false', async () => {
            bmm.get();
            bmm.enableSoftDelete = false;
            await chai.expect((bmm as any).restore(restoreObjectId)).to.be.rejectedWith('This model does not support soft delete.');
        });

        it('should throw exception if collection is undefined.', async () => {
            (bmm as any).collection = undefined;

            let promise = bmm.restore(restoreObjectId);
            await chai.expect(promise).to.be.rejectedWith(`Collection is not set.`);
        });

        it('should throw if id is null', async () => {
            bmm.get();
            await chai.expect((bmm as any).restore(null)).to.be.rejectedWith('Id not set or invalid');
        });

        it('should throw if id is undefined', async () => {
            bmm.get();
            await chai.expect((bmm as any).restore(undefined)).to.be.rejectedWith('Id not set or invalid');
        });

        it('should throw if id is Object', async () => {
            bmm.get();
            await chai.expect((bmm as any).restore({ a: 123 })).to.be.rejectedWith('Id not set or invalid');
        });

        it('should throw if id is Array', async () => {
            bmm.get();
            await chai.expect((bmm as any).restore([1, 22222, 'str'])).to.be.rejectedWith('Id not set or invalid');
        });

        it('should return modifiedCount=0 if the id is not found', async () => {
            bmm.get();
            let res = await bmm.restore(new mongodb.ObjectID(123));
            chai.expect(res.modifiedCount).to.be.eql(0);
        });

        it('should return modifiedCount=1 & set __deleted property of the entry to false if enableSoftDelete=true and id is found', async () => {
            bmm.get();
            let res = await bmm.restore(restoreObjectId);
            chai.expect(res.modifiedCount).to.be.eql(1);

            let check = await bmm.get().findOne({_id: restoreObjectId});
            chai.expect((check as any).__deleted).to.be.false;
        });

    });

    describe('Method: public read<R extends AppBaseRequest>(req: R, projection: string = \'default\', relationProjections?: {[P in keyof T]? : string}): Promise<T[]>', () => {
      
        let relIds;
        let ids;

        before(async () => {
            let col = bmm.get();
            let relCol = relModel.get();
            let entries: Partial<ITestMongoModel>[] = [{
                    foo: 123,
                    bar: "123",
                }, {
                    foo: 456,
                    bar: "456",
                }, {
                    foo: 789,
                    bar: "789",
            }];
            let relEntries = [{
                    baz: 'tetetete'
                },
                {
                    baz: 'this'
                },
                {
                    baz: 'nope'
            }];


            await col.deleteMany({ $or : entries });
            await relCol.deleteMany({ $or : relEntries });

            let insertRels = await relCol.insertMany(relEntries);

            relIds = insertRels.insertedIds;
            entries.forEach((val, id) => {
                entries[id].rel = relIds[id];
            })

            let insertResult = await col.insertMany(entries);
            
            ids = insertResult.insertedIds;
        });

        beforeEach(async () => {
            bmm.checkRelationsValidity = true;
            bmm.projections = {
                default: {
                    foo: true
                },
                extended: {
                    foo: true,
                    bar: true
                }
            }
            bmm.relations = {
                rel: new types.BaseMongoRelation<ITestRelMongoModel>({
                    from: 'testRelCollection',
                    projections: {
                        default: { 
                            _id: false,
                            baz:true
                        },
                        extended: { 
                            baz: true
                        }
                    },
                })
            };
        });

        after(async () => {
            bmm.enableSoftDelete = false;
            bmm.checkRelationsValidity = false;
            bmm.projections = null;
            bmm.relations = null;

            let keys = Object.keys(ids);
            let i;
            for(i = 0; i < keys.length; i++) {
                await bmm.get().deleteOne({ _id: ids[keys[i]] });
            }
            keys = Object.keys(relIds);
            for(i = 0; i < keys.length; i++) {
                let r = await relModel.get().deleteOne({ _id: relIds[keys[i]] });             
            }
        });

        it('should throw if collection is empty.', async () => {
            (bmm as any).collection = null;
            let promise = bmm.read({} as AppBaseRequest);

            await chai.expect(promise).to.be.rejectedWith(`Collection is not set.`);
        });

        it('should throw if req is empty', async () => {
            bmm.get();

            let promise = (bmm as any).read();
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req is an array', async () => {
            bmm.get();

            let promise = (bmm as any).read([]);
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req is null', async () => {
            bmm.get();

            let promise = (bmm as any).read(null);
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req is undefined', async () => {
            bmm.get();

            let promise = (bmm as any).read(undefined);
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req is a number', async () => {
            bmm.get();

            let promise = (bmm as any).read(123);
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req is a boolean', async () => {
            bmm.get();

            let promise = (bmm as any).read(true);
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req.query is empty', async () => {
            bmm.get();

            let promise = (bmm as any).read({});
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req.query is an array', async () => {
            bmm.get();

            let promise = (bmm as any).read({ query: []});
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req.query is null', async () => {
            bmm.get();

            let promise = (bmm as any).read({ query: null});
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req.query is undefined', async () => {
            bmm.get();

            let promise = (bmm as any).read({ query: undefined });
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req.query is a number', async () => {
            bmm.get();

            let promise = (bmm as any).read({ query: 123 });
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        it('should throw if req.query is a boolean', async () => {
            bmm.get();

            let promise = (bmm as any).read({ query: true });
            await chai.expect(promise).to.be.rejectedWith(`Query empty.`);
        });

        describe("Test without relations", () => {

            before(() => {
                bmm.relations = undefined;
                bmm.filters = undefined;
            });

            it('should return entry with specific foo: 123 if foo is set in bmm.filters', async () => {
                bmm.get();
                bmm.filters = ['foo'];

                let result = await bmm.read({ query: {
                    foo: 123
                }} as any);

                chai.expect(result.length).to.be.eq(1);
                chai.expect(result[0]._id.equals(ids[0])).to.true;
            })
        })
    })
});