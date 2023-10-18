# Back-end test

This tech assignment is designed with a deliberate touch of vagueness. The goal is to see how you approach ambiguous situations and make design choices that you can justify. If you're unsure about anything feel free to take a decision, but don't forget to explain your thought process. If you find yourself needing more information, don't hesitate to reach out with your questions. We understand the importance of problem-solving, but don't want you to get stuck for too long. Your ability to prioritize and make informed decisions is key.

## The pitch

You have been recruited as part of the Cloud team as Senior Back-end Engineer. Your first assignment is creating a robust API for an admin panel that will be used internally. 

When you talk to them about an MVP, the project owner would like to be able to initially list and manage projects and deployments. You have an appointment with him in a few days. You agree to provide an initial deliverable that can be retrieved via a git repo and, if necessary, any schematics useful for the design.

## Requirements

- The services must be developed with Node.js using TypeScript.
- Functional programming style is appreciated.
- You must use a Postgres database for storage. 
- Use Docker so anyone can run the project directly.
- Use git to version your code.
- Send your git repository as a zip file (including the `.git` directory).
- Add a write up explaining your choices and describing the work you did.

## Technical specifications

You will find a TypeScript skeleton in the [code](./code) folder to speed the initial setup. You are free to use it or not.

### The project server

- Use `koa` to create the server.
- The server must be secured by static bearer token that you provide (don't create a whole authentication system).
- The server must run on port `3000`.

### Testing

You should create both end to end and unit tests.

### Libraries

- Use `knex` for database migration and database querying (do not use an ORM).
- Use `jest` for testing.
- You can use more libraries if needed.

### Data

You will find two files with some data:

- `./projects.json` contains the projects.
- `./users.json` contains a list of users.

You will notice that there are no requirements regarding a feature to create projects or users. Your code should then offer the possibility to seed the database with this data so it is possible to create deployments using those projects.

## Functional specifications

### Project service

This public service is supposed to be used to get information related to projects and manage deployments.

#### Models

**Project**

| Field       | Type     |
| ----------- | -------- |
| id          | integer  |
| name        | string   |
| url         | string   | (is nullable)
| app_secret  | string   |
| created_at  | datetime |

**Deployment**

| Field       | Type     |
| ----------- | -------- |
| id          | integer  |
| deployed_in | integer  | (is nullable. It represent the time, in seconds, it took for the deployment to finish.)
| status      | string   | (possible values are `pending`, `building`, `deploying`, `failed`, `cancelled`, and `done`)
| created_at  | datetime |

_Relations_:

- **A Project has many Deployment**

**User**

| Field        | Type     |
| ------------ | -------- |
| id           | integer  |
| email        | string   |
| username     | string   |
| created_at   | datetime |

_Relations_:

- **A Project has an owner (user)**

#### API Requirements

For projects:
- An endpoint to retrieve a paginated list of projects, with 8 projects per page;
- An endpoint to retrieve a project by its unique identifier;
- An endpoint to create new deployments for a project. New deployments are created with the `pending` status;
- When projects are retrieved, two properties should be computed:
  - `hasOngoingDeployment` boolean should be set to `true` if the project has a deployment in the `pending`, `building`, or `deploying` status, otherwise `false`;
  - `hasLiveDeployment` boolean should be set to `true` if the project has at least one deployment in the done `status`, otherwise `false`.

For deployments:
  - An endpoint to retrieve a paginated list of deployments, with 8 deployments per page;
  - An endpoint to retrieve deployment by its unique identifier;
  - A webhook endpoint that can be used to receive status updates for a deployment:
    - If it's the first deployment of a project and the status is `done`, the webhook handler should update the project URL with a randomly generated URL;
    - When an update arrives with the `done` status, the `deployed_in` property on the deployment should be filled with the time it took (in seconds) to go from `pending` to `done`;
    - The webhook request are authenticated by checking the `authorization` header against the project `app_secret`;
    - The endpoint needs to be generic. The payload should contain the necessary information to update the deployment in our database.
  - An endpoint to cancel a deployment. This endpoint should update the deployment status to `cancelled`, not delete it.

For every performed actions (deployment creation, cancellation, status update, ...) a new event must be created in the Data Aggregator service. The event must be created in an asynchronous fashion to not impact the performances of the project service. These events are used for analytics purposes, please include all the data you think is relevant into the payload. For the context of this assignement you can assume that the logic to create an event already exists within this service. If you are using the code that was provided you will find a data-aggregation modules that can be used to mimick the call to an external service.

Another engineer wrote a specification for the API to help you. You can use their API spec proposal in the [project-api.yaml](./project-api.yaml) file. You can choose to follow it or change it if necessary. Don't forget to justify your choice in your write-up.

## Bonus

If you have extra time and want to have fun you can do the following:
- Use Auth0 to handle the authentication layer of the project service.
- Add a new endpoint to get deployment statistics for a user:
  - Average weekly successful deployment;
  - Average weekly deployment count.
- Create a new separate service for the data aggregation to replace the mock that was put in place.
