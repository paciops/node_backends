import { Request, Response } from "express";
import { body, param } from "express-validator";
import { inject } from "inversify";
import { controller ,httpGet,httpPost,httpPut,interfaces, request, response} from "inversify-express-utils";
import TYPES from "../constants/types-constants";
import { HttpStatus } from "../enums/http-status-enum";
import { AuthMiddleware } from "../helpers/auth-middleware";
import { handleError } from "../helpers/handle-error";
import {  RequestValidator } from "../helpers/request-validator";
import { ItemsValidator } from "../helpers/type-validator";
import { SafeboxService } from "../services/safebox-service";


@controller("/safebox")
export class SafeboxController<T> implements interfaces.Controller {
    constructor(@inject(TYPES.SafeboxService) private  readonly _safeboxService: SafeboxService<T>) {}

    @httpPost("/",
        body("name").notEmpty().isString(),
        body("password").notEmpty().isString().isStrongPassword({
            minLength:8,
            minLowercase:1,
            minUppercase:1,
            minNumbers:1,
            minSymbols:1
        }),
        RequestValidator
    )
    createSafebox(
        @request() req: Request,
        @response() res: Response
    ) {
        const { name, password } = req.body
        return this._safeboxService.create(name, password)
            .then(response => res.status(HttpStatus.OK).json(response))
            .catch(e => handleError(e, res))
    }

    @httpGet("/:id/items",
        param("id").notEmpty().isString(),
        RequestValidator,
        AuthMiddleware,
    )
    getSafebox(
        @request() req: Request,
        @response() res: Response
    ) {
        const { id } = req.params
        return this._safeboxService.getItems(id)
            .then(response => res.status(HttpStatus.OK).json(response))
            .catch(e => handleError(e, res))
    }

    @httpPut("/:id/items",
        param("id").notEmpty().isString(),
        body("items").isArray().notEmpty(),
        RequestValidator,
        ItemsValidator,
        AuthMiddleware
    )
    addItemToSafebox(
        @request() req: Request,
        @response() res: Response
    ) {
        const { id } = req.params
        return this._safeboxService.addItems(id, req.body.items)
            .then(response => res.sendStatus(HttpStatus.OK))
            .catch(e => handleError(e, res))
    }
}