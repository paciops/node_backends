import { HttpStatus } from "../enums/http-status-enum"
import ErrorInterface from "./ErrorInterface"

export default class NotFoundError implements ErrorInterface{
    name = "NotFoundError"
    message: string
    code: number

    constructor(message: string, code = HttpStatus.NOT_FOUND){
        this.message = message
        this.code = code
    }

}