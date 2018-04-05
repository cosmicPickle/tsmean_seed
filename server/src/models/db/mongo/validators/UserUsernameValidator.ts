import BaseValidator from "../../../../core/db/mongo/validators/BaseValidator";

export class UserUsernameValidator extends BaseValidator {
    message = "error_validation_user_username"
    validator(v) {
    return (/^([a-zA-z])*$/).test(v);
    }
}

export let userUsernameValidator = new UserUsernameValidator();