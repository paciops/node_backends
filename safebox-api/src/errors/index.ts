import ErrorInterface from "./ErrorInterface";

export * from "./AlreadyExist"
export * from "./AuthError"
export * from "./NotFound"

interface ConstructorOf<CLASS> {
    new (...args: ReadonlyArray<never>): CLASS;
}

export function givenError(error: unknown) {
    let called = false
    const actions = {
        ofType<T extends ErrorInterface>(ErrorType: ConstructorOf<T>) {
            return {
                do(fn: (error: T) => void) {
                    if (error instanceof ErrorType) {
                        called = true
                        fn(error);
                    }
                    return actions;
                }
            }
        },
        anyOther(fn: () => void) {
            if(!called){
                fn()
            }
        }
    }
    return actions
}