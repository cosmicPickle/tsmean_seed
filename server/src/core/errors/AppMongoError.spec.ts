import 'mocha';
import { expect } from 'chai';
import { appMongoError } from './../../configuration/errors/errorsConfig';

describe('Error: AppMongoError', () => {

    describe('parse()', () => {
        it('should return mongoose_validation_error if .errors property is defined', () => {
            const err = {
                message: 'Mongo Validation Error',
                name: 'Error',
                errors: {
                    username: {
                        kind: 'regexp_validation',
                        path: 'username',
                        message: 'You are using disallowed symbols',
                        value: 'cosmic@$#$'
                    }
                }
            }

            let mongoError = appMongoError.parse(err).get();
            expect(mongoError).to.haveOwnProperty('message');
            expect(mongoError.message).to.equal('mongoose_validation_error');
            expect(mongoError).to.haveOwnProperty('payload');
            expect(mongoError.payload).to.haveOwnProperty('invalid');
            expect((mongoError.payload as any).invalid).to.eql([err.errors.username]);
        })

        it('should return mongoose_duplicate_key_error if messasge LIKE duplicate key error', () => {
            const err = {
                message: 'E11000: duplicate key error for username',
                name: 'Error',
            }

            let mongoError = appMongoError.parse(err).get();
            expect(mongoError).to.haveOwnProperty('message');
            expect(mongoError.message).to.equal('mongoose_duplicate_key_error');
        })

        it('should return mongoose_duplicate_key_error if messasge LIKE duplicate key error', () => {
            const err = {
                message: 'Mongo Error',
                name: 'Error',
            }

            let mongoError = appMongoError.parse(err).get();
            expect(mongoError).to.haveOwnProperty('message');
            expect(mongoError.message).to.equal('mongoose_error');
        })
    })

})