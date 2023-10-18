import { HttpStatus } from "../enums/http-status-enum"
import ErrorInterface from "./ErrorInterface"

export default class AuthError  implements ErrorInterface{
    name = "AuthError"
    message: string
    code: number

    constructor(message: string, code = HttpStatus.UNAUTHORIZED){
        this.message = message
        this.code = code
    }
}