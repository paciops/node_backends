/* eslint-disable import/first */
import { config } from 'dotenv';

config({ path: './.env' });

import { Knex } from 'knex';
import { convertToCamelCase, convertToSnakeCase } from './utils/index';
import defaults from './config/database';

const objectKeysProcess = (obj: object, f: (str: string) => string) =>
  Object.entries(obj).reduce((acc, [k, v]) => ({ ...acc, [f(k)]: v }), {});

const postProcessResponse: Knex.Config['postProcessResponse'] = (result) => {
  if (result === undefined || result === null) return result;
  if (Array.isArray(result)) {
    return result.map((el) => {
      const type = typeof el;
      switch (type) {
        case 'string':
          return convertToCamelCase(el);
        case 'object':
          return objectKeysProcess(el, convertToCamelCase);
        default:
          // other types are not implemented at the moment
          return el;
      }
    });
  }
  if (result instanceof Object) {
    return objectKeysProcess(result, convertToCamelCase);
  }
  if (typeof result === 'number') return result;
  return convertToCamelCase(result);
};

const wrapIdentifier: Knex.Config['wrapIdentifier'] = (value, origImpl) =>
  origImpl(convertToSnakeCase(value));

const knexConfig: { [key: string]: Knex.Config } = {
  test: {
    ...defaults,
    useNullAsDefault: true,
    postProcessResponse,
    wrapIdentifier,
  },

  local: {
    ...defaults,
    debug: true,
    postProcessResponse,
    wrapIdentifier,
  },

  development: {
    ...defaults,
    debug: true,
    postProcessResponse,
    wrapIdentifier,
  },

  production: {
    ...defaults,
    postProcessResponse,
    wrapIdentifier,
  },
};

export default knexConfig;
