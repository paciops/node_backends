import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import TYPES from "../constants/types-constants";
import AuthError from "../errors/AuthError";
import NotFoundError from "../errors/NotFound";
import { SafeboxService } from "../services";
import { handleError } from "./handle-error";

@injectable()
export class AuthMiddleware<T> extends BaseMiddleware{
    @inject(TYPES.SafeboxService)
    private readonly _safeboxService!: SafeboxService<T>;

    public async handler(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { authorization } = req.headers
    
            if(!authorization)
                throw new AuthError("Missing authorization")
    
            const [_, base64] = authorization.split(" ")
            const [name, password] = Buffer.from(base64||"", 'base64').toString().split(":")

            if(!name.length || !password)
                throw new AuthError("Wrong authorization data")
    
            const safebox = await this._safeboxService.getByName(name)
            
            if(!safebox)
                throw new NotFoundError("Requested safebox does not exist")
    
            if (safebox.password !== password)
                throw new AuthError("Specified Basic Auth does not match")
            
            next()
        } catch (error) {
            handleError(error, res)
        }
    }
}