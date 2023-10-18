# Description

This is an API written in TypeScript, using Koa as framework, Jest for testing and PostgreSQL as database.
On top of that, other libraries are used:

- **joi** to validate data;
- **koa-body** to parse the body of the POST request;
- **koa-context-validator** to write middlewares that could validate request input;

# Folder structure

- `config/` contains .ts for static variable like database connection or table names;
- `infrastructure/database/` contains the code and scripts relative to Postgre;
- `interface/` contains interfaces that incorporate business logic for users, projects, and deployments, in addition to the interface of each entity;
- `modules/` contains most of the important code like the entities that implement the business logic, the http loader with each route, all the middlewares and the validator;
- `utils/` contains some utility function used to process strings and data structures;

# Design choice

## API

Since Koa works with composition of functions and middlewares I decided to keep the core into [the loader](./code/src/modules/http/index.ts).
Here we find two functions that return functions: `project` and `deployment`. Using these structures allow initialize the function with a parameter (in this case a class that implements an interface) and let the functions returned to use this parameter without creating a class. These returned functions then are used as middleware into koa-router. In fact chaining these functions with middlewares and validator allows to create modular and recyclable endpoints.
In order to make the correct database call these high order functions take as input a class that implements an interface called `logic`: this logic contains the business logic of the entity. Using a mechanism like this allows the developer to use the power of dependency injection with the simplicity of the high order function. For example in this project as database is used PostgreSQL and the query are written using knex, in case we want to change database we could just create a class that implement the logic and use the new db under the hood, the initialize the new db into the http loader and pass it to the high order function.
If the interface is respected then the API will work as before.
The functions returned by the high order function have to respect a specific sign: each one takes as input the context provided by Koa.

## Authentication

Since there is no authentication system, with a middleware on every request it is checked if a `Bearer toker` is present but nothing more. Only for the webhook endpoint a different check is done: the token must be equal to the `app_secret` of the project.

## Data aggregator

Since the data aggregator service must not slow down the users' requests, the send function is called into a separate thread, implemented with `worker_threads` Node.js API.

## Middlewares and validators

Koa allows the developers to chain multiple functions to create an API. Using this feature a good solution is to put most of the error handler and input validator into these functions.
For example to avoid having internal server error thrown by the database driver, a middleware could catch this error, check its type and send to the user the correct error code.
With this concept also the validation of the input could be done with a middleware: an input could contain a numeric id, in case a string is passed an error will be throw by the validator and then another middleware on top of the validator can intercept that error and send the correct response to the user.

## API spec

The [project-api.yaml](./project-api.yaml) is the same, except for the fact that the fields `hasOngoingDeployment` and `hasLiveDeployment` where called `hasLiveDeployment` and `hasPendingDeployment`. These two fields are changed in this API specification.

# Usage

Use all this command under the code folder.
## Build and run
To build the API use
```bash
npm run build
```
To run with docker use
```bash
docker-compose up
```
## Local development

To run locally use
```bash
npm run develop
```
PostgreSQL is required for local development or for testing and it can be started with the script
```bash
./run-postgres.sh
```
this script also create the correct tables into PostgreSQL.
# Test

To test the API use
```bash
./run-postgres.sh
npx ts-node src/infrastructure/database/seeds/users.ts .env
npx ts-node src/infrastructure/database/seeds/projects.ts .env
npm run test
```
## Database migration and seeds

Using knex for migration and seeds did not work, so I decided to use the sql file and the scripts under database folder for development and testing



