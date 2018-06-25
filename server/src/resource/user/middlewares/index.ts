import { userRouteValidatorMiddleware }  from "./UserRouteValidatorMiddleware";
import { appAuthenticateMiddleware } from "./../../../core/middlewares/AppAuthenticateMiddleware";
import { AppMiddleware } from "../../../core/middlewares/AppMiddleware";

export let validator: AppMiddleware = userRouteValidatorMiddleware;
export let middlewares: AppMiddleware = {
    _: [appAuthenticateMiddleware.check]
}

