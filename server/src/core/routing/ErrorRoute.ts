import { Response, Request } from "express";

import { AppRoute } from "./AppRoute";
import { Error } from "../models/resource/error/ErrorDocument";
import { ErrorPostRequest } from "../models/resource/error/types";
import { appGeneralError, appMongoError } from "../../configuration/errors/errorsConfig";

export class ErrorRoute extends AppRoute {
    protected path = '/errors/:code?';

    async get(req: ErrorPostRequest, res: Response) {
        if(req.params.name) {
            try {
                const err = await Error.findOne({
                    code: req.params.code
                }).exec();
                
                if(!err)
                    return res.json(appGeneralError.get());

                return res.json({
                    code: err.code,
                    default: err.default,
                    language: err.language
                });
            } catch(err) {
                return res.json(appMongoError.parse(err).get());
            }
        } else {
            //TO DO: .......................
        }
    }
}