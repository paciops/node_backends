import { Knex } from 'knex';
import tables from '../../../config/tables';

export async function up(knex: Knex) {
  return knex.schema.createTable(tables.deployment, (table) => {
    table.increments('id').primary();
    table.integer('deployed_in');
    table
      .enu('status', ['pending', 'building', 'deploying', 'failed', 'cancelled', 'done'])
      .notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.integer('project_id').references('id').inTable('project');
  });
}

export const down = (knex: Knex) => knex.schema.dropTableIfExists(tables.deployment);
