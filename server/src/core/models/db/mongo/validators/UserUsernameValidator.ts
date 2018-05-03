import BaseValidator from "./BaseValidator";

export class UserUsernameValidator extends BaseValidator {
    message = "error_validation_user_username"
    validator(v) {
        return (/^([a-zA-z0-9])*$/).test(v);
    }
}

export let userUsernameValidator = new UserUsernameValidator();