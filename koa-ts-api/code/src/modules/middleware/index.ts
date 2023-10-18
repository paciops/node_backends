import { ValidationError } from 'joi';
import { Next } from 'koa';
import Router from '@koa/router';

import { ErrorInterface, NotFoundError, UnauthorizedError } from '../../utils/errors/index';
import { calculatePaginationLinks } from '../../utils/index';

type MiddlewareContext = Parameters<Parameters<Router['get']>[1]>[0];

export const validationErrorHandler = async (ctx: MiddlewareContext, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ValidationError) {
      const validationError: ErrorInterface = {
        name: 'validation error',
        message: error.details.map(({ message }) => message).join(', '),
      };
      ctx.status = 400;
      ctx.body = validationError;
    } else {
      throw error;
    }
  }
};

export const databaseErrorHandler = async (ctx: MiddlewareContext, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof NotFoundError) {
      ctx.status = 404;
      ctx.body = error;
    } else if (error instanceof UnauthorizedError) {
      ctx.status = 401;
      ctx.body = error;
    } else {
      throw error;
    }
  }
};

export const internalErrorHandler = async (ctx: MiddlewareContext, next: Next) => {
  try {
    await next();
  } catch (e) {
    console.error(e);
    const error: ErrorInterface = {
      name: 'Server error',
      message: '',
    };
    ctx.status = 500;
    ctx.body = error;
  }
};

export const authorizationHandler = async (ctx: MiddlewareContext, next: Next) => {
  const { authorization } = ctx.headers;

  if (authorization === undefined) {
    ctx.status = 401;
    ctx.body = new UnauthorizedError('Missing token');
    return;
  }

  const tokens = authorization.split(' ');

  if (tokens[0] !== 'Bearer') {
    ctx.status = 401;
    ctx.body = new UnauthorizedError('Wrong auth system');
    return;
  }

  // any value for tokens[1] is correct in this case
  const [, user] = tokens;
  ctx.user = user;

  await next();
};

export const paginationHandler = async (ctx: MiddlewareContext, next: Next) => {
  const currentPage = ctx.query.page || 1;
  const baseUrl = ctx.request.origin;

  ctx.set('Link', calculatePaginationLinks(currentPage as number, baseUrl));

  await next();
};
