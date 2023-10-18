import { TypeValidator, ValidationResult } from "../../../helpers/type-validator"

export class StringValidator extends TypeValidator {
    validate(input: unknown) {
        const result : ValidationResult = {
            isValid: true,
            errors: []
        }
        if (typeof input !== "string") {
            result.isValid = false
            result.errors = [`${input} is not a string`]
        }
        return  result
    }
}
