import { AppGeneralError } from './../../core/errors/AppGeneralError';
import { AppInvalidRouteError } from './../../core/errors/AppInvalidRouteError';
import { AppAuthorizationError } from './../../core/errors/AppAuthorizationError';
import { AppRouteValidationError } from './../../core/errors/AppRouteValidationError';
import { AppMongoError } from './../../core/errors/AppMongoError';
import { AppUnknownUserError } from './../../core/errors/AppUnknownUserError';
import { AppUnknownGroupError } from './../../core/errors/AppUnknownGroupError';

export let appGeneralError = new AppGeneralError(1000);
export let appInvalidRouteError = new AppInvalidRouteError(1001);
export let appAuthorizationError = new AppAuthorizationError(1002);
export let appRouteValidationError = new AppRouteValidationError(1003);
export let appMongoError = new AppMongoError(1004);
export let appUnknownUserError = new AppUnknownUserError(1005);
export let appUnknownGroupError = new AppUnknownGroupError(1006);