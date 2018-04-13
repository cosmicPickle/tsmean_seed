import BaseValidator from './BaseValidator';

export class BaseAsyncValidator extends BaseValidator {
    isAsync: boolean = true
    message = 'BaseAsyncValidator default message. Should not be seeing this.'
}