import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { mongoose } from './../connection';
import { UserUsernameValidator } from './UserUsernameValidator';
import { expect } from 'chai';

describe('validator UserUsernameValidator', () => {

    it('should validate if value consists of letters only', () => {
        let u = new UserUsernameValidator()
        expect(u.validator('testTest')).to.be.true;
    });

    it('should fail to validate if value contains numbers', () => {
        let u = new UserUsernameValidator()
        expect(u.validator('testTest123')).to.be.false;
    });

    it('should fail to validate if value contains symbols', () => {
        let u = new UserUsernameValidator()
        expect(u.validator('testTest!@$%')).to.be.false;
    })

    it('should fail to validate if value is a number', () => {
        let u = new UserUsernameValidator()
        expect(u.validator(13313)).to.be.false;
    })
})
