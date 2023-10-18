import { Knex } from 'knex';
import tables from '../../../config/tables';

export async function up(knex: Knex) {
  return knex.schema.createTable('project', (table) => {
    table.increments('id').primary();
    table.string('name', 250).notNullable();
    table.string('app_secret', 32).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.string('url', 250);
    table.integer('user_id').notNullable().references('id').inTable('user');
  });
}

export const down = (knex: Knex) => knex.schema.dropTableIfExists(tables.project);
