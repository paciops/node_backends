import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { injectable } from "inversify";
import { BaseMiddleware} from "inversify-express-utils";
import { HttpStatus } from "../enums/http-status-enum";

@injectable()
export class RequestValidator extends BaseMiddleware {

    public handler(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({errors: validationErrors.array()});
        }

        return next();
    }
}