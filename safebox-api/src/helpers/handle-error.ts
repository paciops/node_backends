import { Response,  } from "express";
import { givenError } from "../errors";
import AlreadyExistError from "../errors/AlreadyExist";
import AuthError from "../errors/AuthError";
import ErrorInterface from "../errors/ErrorInterface";
import NotFoundError from "../errors/NotFound";

const sendError = (res: Response, e: ErrorInterface) => res.status(e.code).send(e.message)

export function handleError(error: unknown, res: Response){
    givenError(error)
     .ofType(AlreadyExistError).do(e => sendError(res, e))
     .ofType(AuthError).do(e => sendError(res, e))
     .ofType(NotFoundError).do(e => sendError(res, e))
     .anyOther(()=> {
        throw error
     })
}