import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { after } from 'mocha';
import { mongoose } from './../../../core/models/db/mongo/connection';
import { User } from './UserModel';
import { expect } from 'chai';

describe('model UserModel', () => {

    after(function(done){
        mongoose.connection.close();
        done();
    });

    // it('should have a hasPermissions function', (done) => {
    //     let user = new User();
    //     expect(user).to.have.property('hasPermission');
    //     done();
    // })
    
    it('should be invalid if username is empty', () => {
        let user = new User();
        user.validate((err) => {
            expect(err.errors.username).to.exist;
        })
    })

    it('should be invalid if username does not consist of letters', () => {
        let user = new User();
        user.username = '123';

        user.validate((err) => {
            expect(err.errors.username).to.exist;
            expect(err.errors.username.message).to.eq('error_validation_user_username');
        })
    })

    it('should be invalid if password is empty', () => {
        let user = new User();
        user.username = 'test';

        user.validate((err) => {
            expect(err.errors.password).to.exist;
        })
    })

    it('should be valid', () => {
        let user = new User();
        user.username = 'test';
        user.password = '123qwe123'

        user.validate((err) => {
            expect(err).to.be.null;
        })
    })
});
