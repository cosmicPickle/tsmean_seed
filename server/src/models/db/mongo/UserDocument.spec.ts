import * as sinon from 'sinon';
import 'mocha';  
import { SinonStub } from 'sinon';
import { mongoose } from './../../../core/models/db/mongo/connection';
import { User } from './UserDocument';
import { expect } from 'chai';
import { Group, IGroup } from './GroupDocument';

describe('model UserDocument', () => {

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

    it('should be valid', async () => {
        let user = new User();
        user.username = 'test';
        user.password = '123qwe123'
        user.group = new Group();
        user.group.name = "newbie";
        user.group.allowedRoutes = ['/home'];
        user.group.allowedServices = [{
            method: 'get',
            path: `/group/${user.group.name}`
        }];
        
        user.validate((err) => {
            expect(err).to.be.null;
        })
    })
});
