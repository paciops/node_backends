import { HttpStatus } from "../enums/http-status-enum"
import ErrorInterface from "./ErrorInterface"

export default class AlreadyExistError  implements ErrorInterface{
    name = "AlreadyExistError"
    message: string
    code: number

    constructor(message: string, code = HttpStatus.CONFLICT){
        this.message = message
        this.code = code
    }
}