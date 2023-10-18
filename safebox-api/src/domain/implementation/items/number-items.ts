import { TypeValidator } from "../../../helpers/type-validator"

export class NumberValidator extends TypeValidator {
    validate(input: unknown) {
        const result  = {
            isValid: true,
            errors: new Array<string>()
        }
        if(typeof input === "string" && input.length === 0) {
            result.isValid = false
            result.errors = [`${input} is an empty string`]
        } else if(!input){
            result.isValid = false
            result.errors = [`${input} is undefined or null`]
        } else if (isNaN(Number(input))) {
            result.isValid = false
            result.errors = [`${input} is not a number`]
        }
        return  result
    }
}