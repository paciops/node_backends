import { Knex } from 'knex';
import { DatabaseError } from 'pg';
import { randomBytes } from 'crypto';
import { DeploymentLogic } from '../../interface/logic/index';
import { Deployment, Status } from '../../interface/models/index';
import tables from '../../config/tables';
import { NotFoundError, UnauthorizedError } from '../../utils/errors/index';

type Result<T> = {
  command: string;
  rowcount: number;
  rows: T[];
};

export class DeploymentEntity implements DeploymentLogic {
  knex: Knex;

  fields = ['id', 'deployedIn', 'status', 'createdAt', 'projectId'] as const;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  deploymentsClient() {
    return this.knex<Deployment>(tables.deployment);
  }

  async getById(id: number) {
    const deployment = await this.deploymentsClient().where('id', id).first();
    if (deployment === undefined)
      throw new NotFoundError('Deployment not found', `Deployment with id = ${id} not found`);
    return deployment;
  }

  async getAll(limit?: number, skip?: number) {
    const deployments = await this.deploymentsClient()
      .modify((queryBuilder) => {
        if (limit !== undefined) queryBuilder.limit(limit);
        if (skip !== undefined) queryBuilder.offset(skip);
        return queryBuilder;
      })
      .select(this.fields);
    return deployments;
  }

  async create(id: number) {
    try {
      const [result] = await this.deploymentsClient().insert(
        { projectId: id, status: 'pending', createdAt: this.knex.fn.now() },
        this.fields
      );
      return result;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw new NotFoundError('Project not found', `Project with id = ${id} not found`);
      }
      throw error;
    }
  }

  async cancel(id: number) {
    const [deployment] = await this.deploymentsClient()
      .update('status', 'cancelled')
      .where('id', id)
      .returning(this.fields);

    if (deployment === undefined)
      throw new NotFoundError('Deployment not found', `Deployment with id = ${id} not found`);

    return deployment;
  }

  async generateProjectURL(id: Deployment['id']) {
    const url = `${randomBytes(8).toString('hex')}.example.com`;

    const updateResult = await this.knex.transaction<
      Result<{ project_id: number; created_at: Date; status: Status; project_url: string }>
    >((trx) => {
      const isFirstDeploymentQuery = `
        WITH target_deployment AS (
          SELECT
            d.project_id,
            d.created_at,
            d.status
          FROM
            ${tables.deployment} d
          JOIN
          ${tables.project} p
          ON
            d.project_id = p.id
          WHERE
            d.id = :id
        )
        UPDATE
        ${tables.project} p
        SET
          url = CASE
            WHEN (
                (SELECT COUNT(*) FROM ${tables.deployment} d WHERE d.project_id = (SELECT project_id FROM target_deployment) AND d.created_at < (SELECT created_at FROM target_deployment)) = 0)
                AND (SELECT status FROM target_deployment) = 'done'
            THEN
                COALESCE(p.url, :url)
            ELSE
                p.url
          END
        FROM
          (SELECT * FROM target_deployment) AS target_deployment
        WHERE
          p.id = (SELECT project_id FROM target_deployment)
        RETURNING target_deployment.*`;
      trx.raw(isFirstDeploymentQuery, { id, url }).then(trx.commit).catch(trx.rollback);
    });

    if (updateResult.rowcount < 1)
      throw new UnauthorizedError('Cannot perform this operation on this deployment');

    const [rawDeployment] = updateResult.rows;
    const deployment = {
      id,
      projectId: rawDeployment.project_id,
      status: rawDeployment.status,
      createdAt: rawDeployment.created_at,
    };
    return deployment;
  }

  async setDeployTime(id: Deployment['id']) {
    await this.knex.transaction((trx) => {
      const updateQuery = `
      UPDATE ${tables.deployment}
      SET
        status = CASE
          WHEN status = 'pending' THEN 'done'
          ELSE status
        END,
        deployed_in = CASE
          WHEN status = 'pending' THEN EXTRACT(EPOCH FROM NOW() - "created_at")::integer
          ELSE deployed_in
        END
      WHERE
        id = :id
      RETURNING *`;

      trx.raw(updateQuery, { id }).then(trx.commit).catch(trx.rollback);
    });
  }

  async isAuthenticated(id: Deployment['id'], appSecret: string) {
    const result = await this.deploymentsClient()
      .select(`${tables.deployment}.id as deploymentId`, `${tables.project}.id as projectId`)
      .leftJoin(tables.project, (joinClause) => {
        joinClause
          .on(`${tables.deployment}.projectId`, '=', `${tables.project}.id`)
          .andOn(`${tables.project}.appSecret`, '=', this.knex.raw('?', [appSecret]));
      })
      .where(`${tables.deployment}.id`, id)
      .first();

    return result !== undefined && result.projectId !== null;
  }

  async updateStatus(id: Deployment['id'], status: Status) {
    await this.deploymentsClient()
      .update('status', status)
      .where('id', id)
      .returning(this.knex.raw('*'));
  }
}
