import validator, { Joi } from 'koa-context-validator';

import { Statuses, Status } from '../../interface/models/index';

export const pageValidator = validator({
  query: Joi.object().keys({ page: Joi.number().min(0) }),
});

export const idValidator = validator({
  params: Joi.object().keys({ id: Joi.number().min(0) }),
});

export const bodyValidator = validator({
  body: Joi.object().keys({
    id: Joi.number().min(0),
    status: Joi.string().valid(...(Object.values(Statuses) as Status[])),
  }),
});
