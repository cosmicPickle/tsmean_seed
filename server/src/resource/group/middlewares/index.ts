import { groupRouteValidatorMiddleware }  from "./GroupRouteValidatorMiddleware";
import { appAuthenticateMiddleware } from "./../../../core/middlewares/AppAuthenticateMiddleware";
import { AppMiddleware } from "../../../core/middlewares/AppMiddleware";

export let validator: AppMiddleware = groupRouteValidatorMiddleware;
export let middlewares: AppMiddleware = {
    //_: [appAuthenticateMiddleware.check]
}

