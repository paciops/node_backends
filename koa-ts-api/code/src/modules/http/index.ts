import Koa from 'koa';
import Router from '@koa/router';
import { ParsedUrlQuery } from 'node:querystring';
import { koaBody } from 'koa-body';
import serverConfig from '../../config/server';
import knex from '../../infrastructure/database/index';
import { DeploymentLogic, ProjectLogic } from '../../interface/logic/index';
import { DeploymentEntity, ProjectEntity } from '../entity/index';
import { UnauthorizedError } from '../../utils/errors/index';
import { Status } from '../../interface/models/index';
import { sendToThread } from './worker';
import { bodyValidator, idValidator, pageValidator } from '../validator/index';
import {
  authorizationHandler,
  databaseErrorHandler,
  internalErrorHandler,
  paginationHandler,
  validationErrorHandler,
} from '../middleware/index';

const LIMIT = 8;

type MiddlewareContext = Parameters<Parameters<Router['get']>[1]>[0];

const getLimitAndSkip = (query: ParsedUrlQuery) => {
  const limit = LIMIT;
  let skip: number | undefined;
  if (query.page !== undefined) {
    const page = query.page as unknown as number;
    skip = (page - 1) * limit;
  }
  return [limit, skip];
};

const project = (projectClient: ProjectLogic, deploymentClient: DeploymentLogic) => {
  return {
    async get(ctx: MiddlewareContext) {
      ctx.status = 200;
      ctx.body = await projectClient.getById(ctx.params.id as unknown as number);
    },
    async listProjects(ctx: MiddlewareContext) {
      ctx.status = 200;
      ctx.body = await projectClient.getAll(...getLimitAndSkip(ctx.query));
    },
    async createProjectDeployment(ctx: MiddlewareContext) {
      const { id } = ctx.params;
      const deployment = await deploymentClient.create(id as unknown as number);
      ctx.body = deployment;
      sendToThread({
        event: 'createProjectDeployment',
        deployment: {
          id: deployment.id,
          createdAt: deployment.createdAt,
          projectId: deployment.projectId,
        },
      });
    },
  };
};

const deployment = (deploymentClient: DeploymentLogic) => {
  return {
    async getDepoyment(ctx: MiddlewareContext) {
      ctx.status = 200;
      ctx.body = await deploymentClient.getById(ctx.params.id as unknown as number);
    },
    async listDeployments(ctx: MiddlewareContext) {
      ctx.status = 200;
      ctx.body = await deploymentClient.getAll(...getLimitAndSkip(ctx.query));
    },
    async cancelDeployment(ctx: MiddlewareContext) {
      ctx.status = 200;
      const deploymentCancelled = await deploymentClient.cancel(ctx.params.id as unknown as number);
      ctx.body = deploymentCancelled;
      sendToThread({
        event: 'cancelDeployment',
        deployment: {
          id: deploymentCancelled.id,
          cancelledAt: new Date(),
          projectId: deploymentCancelled.projectId,
        },
      });
    },
    async deploymentStatusUpdate(ctx: MiddlewareContext) {
      const { id, status }: { id: number; status: Status } = ctx.request.body;
      const token = ctx.user;
      ctx.status = 200;

      if (!(await deploymentClient.isAuthenticated(id, token)))
        throw new UnauthorizedError('Cannot perform this operation');

      if (status === 'done') {
        await deploymentClient.setDeployTime(id);
      }

      await deploymentClient.updateStatus(id, status);
      const deploymentUpdated = await deploymentClient.generateProjectURL(id);

      ctx.body = deploymentUpdated;
      sendToThread({
        event: 'deploymentStatusUpdate',
        deployment: {
          id: deploymentUpdated.id,
          updatedAt: new Date(),
          projectId: deploymentUpdated.projectId,
          statusUpdated: status,
        },
      });
    },
  };
};

export default function httpLoader() {
  const app = new Koa();
  const router = new Router();
  const deploymentEntity = new DeploymentEntity(knex);
  const projectClient = project(new ProjectEntity(knex), deploymentEntity);
  const deploymentClient = deployment(deploymentEntity);

  app.use(internalErrorHandler);
  app.use(authorizationHandler);
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(router.middleware());

  router.get(serverConfig.healthCheck, (ctx) => {
    ctx.status = 200;
  });

  // projects
  router.get(
    '/projects',
    validationErrorHandler,
    pageValidator,
    paginationHandler,
    projectClient.listProjects
  );
  router.get(
    '/projects/:id',
    validationErrorHandler,
    idValidator,
    databaseErrorHandler,
    projectClient.get
  );
  router.post(
    '/projects/:id/deployment',
    validationErrorHandler,
    idValidator,
    databaseErrorHandler,
    projectClient.createProjectDeployment
  );

  // deployments
  router.get(
    '/deployments',
    validationErrorHandler,
    pageValidator,
    paginationHandler,
    deploymentClient.listDeployments
  );
  router.get(
    '/deployments/:id',
    validationErrorHandler,
    idValidator,
    databaseErrorHandler,
    deploymentClient.getDepoyment
  );
  router.post(
    '/deployments/:id/cancel',
    validationErrorHandler,
    idValidator,
    databaseErrorHandler,
    deploymentClient.cancelDeployment
  );
  router.post(
    '/deployments/webhook',
    koaBody(),
    validationErrorHandler,
    bodyValidator,
    databaseErrorHandler,
    deploymentClient.deploymentStatusUpdate
  );

  return app;
}
