import Knex from 'knex';
import knexConfig from '../../knexfile';
import node from '../../config/node';

// Set environment from `.env`
const knex = Knex(knexConfig[node.env]);

export default knex;
