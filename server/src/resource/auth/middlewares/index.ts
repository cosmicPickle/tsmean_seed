import { authRouteValidatorMiddleware }  from "./AuthRouteValidatorMiddleware";
import { appAuthenticateMiddleware } from "./../../../core/middlewares/AppAuthenticateMiddleware";
import { AppMiddleware } from "../../../core/middlewares/AppMiddleware";

export let validator: AppMiddleware = authRouteValidatorMiddleware;
export let middlewares: AppMiddleware = {
    //_: [appAuthenticateMiddleware.check]
}

