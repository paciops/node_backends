# How to run
For local development:
```bash
npm run start:dev
```

For testing:
```bash
npm run test
```

## Tests
All the tests are end-to-end (e2e) tests, achieving nearly 100% coverage. Although additional unit or integration tests could be implemented, they might not be necessary since the existing e2e tests cover almost all cases.

Every possible HTTP error is tested, and all the cases in the [API definition](./open-api.spec.yaml) are covered.

To simplify the testing process, several useful functions are available under [utils](./tests/controllers/utils.ts).

## What is inside?
### Domain
I adopted the clean code architecture, simplifying the entity concept. Everything begins with defining the [logic](./src/domain/interfaces/index.ts). In this project for example `Safebox` is at the base of the `/safebox` endpoint. Thus, the business logic should reside within the `Safebox` class and the `SafeboxLogic<T>` interface. Any implementation must adhere to the interface. For example, [Safebox Array](./src/domain/implementation/safebox-array.ts) implements the logic using an Array, while [Safebox Map](./src/domain/implementation/safebox-map.ts) utilizes a Map. You can inject any data structure into our logic using the [buildServerInstance](./src/app.ts) function, where `SafeboxLogic<T>` is generic, allowing the `items` field of `Safebox` to be of any type.

To validate each item added to the safebox, a `TypeValidator` class has been implemented. This class must be implemented by every validator, such as [StringValidator](./src/do/items/string-items.ts) or [NumberValidator](./src/domain/implementation/items/number-items.ts). This validator is bound to the container so that the **middleware** `ItemsValidator` can verify the type of every item passed.

### Middleware
There are several middlewares in this project:

#### AuthMiddleware
`AuthMiddleware<T>` ensures that each request contains the necessary data to authenticate and authorize it using basic HTTP authorization. `name` and `password` are required in the headers to make a valid request.

#### RequestValidator
`RequestValidator` is a middleware that utilizes `express-validator` to verify whether the body or parameters adhere to specific rules.

#### Type Validators
As mentioned earlier, `TypeValidator` and `ItemsValidator` are responsible for type validation and safebox item validation.

#### Error Handler
The function [`handleError`](./src/helpers/handle-error.ts) is responsible for identifying the error thrown by the service and sending the appropriate HTTP code with an error message to the end user.

## Errors
To avoid confusion, I have implemented three types of errors:

- [AlreadyExist](./src/errors/AlreadyExist.ts)
- [AuthError](./src/errors/AuthError.ts)
- [NotFound](./src/errors/NotFound.ts)

Each error implements `ErrorInterface`, which is necessary for assigning a code number to each error. Every error takes a message as input, along with an optional code. The code represents the default HTTP error code associated with the type of error. Using a separate class for each error allows the function [givenError](./src/errors/index.ts) to call specific functions based on the type of error (see [`handleError`](./src/helpers/handle-error.ts)).
```markdown
