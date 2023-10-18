import { Knex } from 'knex';
import { ProjectLogic } from '../../interface/logic/index';
import { Project } from '../../interface/models/index';
import tables from '../../config/tables';
import { NotFoundError } from '../../utils/errors/index';

export class ProjectEntity implements ProjectLogic {
  knex: Knex;

  fields = ['id', 'name', 'url', 'createdAt'] as const;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  projectClient() {
    return this.knex<Project>(tables.project);
  }

  select() {
    return this.projectClient()
      .select(this.fields)
      .select(
        this.knex.raw(
          `EXISTS (
          SELECT 1
          FROM ${tables.deployment} d
          WHERE d.project_id = ${tables.project}.id
          AND d.status = ANY(?)
        ) as has_ongoing_deployment,
        EXISTS (
          SELECT 1
          FROM ${tables.deployment} d
          WHERE d.project_id = ${tables.project}.id
          AND d.status = 'done'
        ) as has_live_deployment`,
          [['pending', 'building', 'deploying']]
        )
      );
  }

  async getById(id: number) {
    const project = await this.select().where(`${tables.project}.id`, id).first();
    if (project === undefined)
      throw new NotFoundError('Project not found', `Project with id = ${id} not found`);
    return project as unknown as Project;
  }

  async getAll(limit?: number, skip?: number) {
    const projects = await this.select().modify((queryBuilder) => {
      if (limit !== undefined) queryBuilder.limit(limit);
      if (skip !== undefined) queryBuilder.offset(skip);
      return queryBuilder;
    });

    return projects;
  }
}
