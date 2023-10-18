import { Knex } from 'knex';
import tables from '../../../config/tables';

export async function up(knex: Knex) {
  return knex.schema.createTable(tables.user, (table) => {
    table.increments('id').primary();
    table.string('email', 250).notNullable();
    table.string('username', 250).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export const down = (knex: Knex) => knex.schema.dropTableIfExists(tables.user);
