import { NextFunction,Request, Response } from "express"
import { injectable, inject } from "inversify"
import { BaseMiddleware } from "inversify-express-utils"
import TYPES from "../constants/types-constants"
import { HttpStatus } from "../enums/http-status-enum"

export interface ValidationResult {
    isValid: boolean,
    errors: string[]
}

@injectable()
export class TypeValidator{
    validate(input: unknown): ValidationResult {
        throw new Error("Not implemented")
    }

    validateArray(input: unknown[]): ValidationResult {
        return input.reduce((result:ValidationResult, curr) => {
            const validationResult = this.validate(curr)
            if(!validationResult.isValid){
                result.isValid = false
                result.errors.push(...validationResult.errors)
            }
            return result
        }, {
            isValid: true,
            errors: []
        })
    }
}

@injectable()
export class ItemsValidator extends BaseMiddleware {
    constructor(@inject(TYPES.TypeValidator) private  readonly _typeValidator: TypeValidator){
        super()
    }

    public handler(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const items = req.body.items as []
        const validationResults = this._typeValidator.validateArray(items)
        if (validationResults.isValid) {
            return next()
        }
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({errors: validationResults.errors});

    }
}
