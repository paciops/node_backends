import request from 'supertest';
import { Server } from 'http';
import loader from './index';
import knex from '../../infrastructure/database/index';
import tables from '../../config/tables';

const WEBHOOK_TOKEN = 'Jn2xToH72JUcsvqpiucgiDPu06STbiiL';

describe('http loader', () => {
  let app: ReturnType<typeof loader>;
  let server: Server;

  beforeAll(async () => {
    app = loader();
    server = app.listen();
  });

  afterEach(async () => {
    await knex(tables.deployment).del();
  });

  afterAll(async () => {
    server.close();
    await knex.destroy();
  });

  test('/health should return "OK"', async () => {
    const response = await request(server)
      .get('/health')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });
  test('should not be authenticated if bearer token is not valid', async () => {
    const response = await request(server)
      .get('/projects')
      .set('Authorization', '')
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('message');
    expect(response.body.name).toBe('Unauthorized operation');
    expect(response.body.message).toBe('Wrong auth system');
  });
  test('/projects should list 8 projects', async () => {
    const response = await request(server)
      .get('/projects')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(8);
  });
  test('/deployments should list 0 deployments', async () => {
    const response = await request(server)
      .get('/deployments')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
  test('/projects/1/deployment should create one deployment for project 1', async () => {
    const response = await request(server)
      .post('/projects/1/deployment')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('deployedIn');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('projectId');
    expect(response.body).toHaveProperty('status');
  });
  test('/deployments/1/cancel should set deployment status to "cancelled"', async () => {
    const { body } = await request(server)
      .post('/projects/1/deployment')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    const { id } = body;

    const response = await request(server)
      .post(`/deployments/${id}/cancel`)
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('deployedIn');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('projectId');
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('cancelled');
  });
  test('/deployments/webhook should change deployment status', async () => {
    const status = 'done';
    const { body } = await request(server)
      .post('/projects/1/deployment')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    const { id } = body;

    const response = await request(server)
      .post('/deployments/webhook')
      .send({ id, status })
      .set('Authorization', `Bearer ${WEBHOOK_TOKEN}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('projectId');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe(status);
  });
  test('/deployments/1 should not found a deployment', async () => {
    const response = await request(server)
      .get('/deployments/1')
      .set('Authorization', 'Bearer token')
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('message');
    expect(response.body.name).toBe('Deployment not found');
    expect(response.body.message).toBe('Deployment with id = 1 not found');
  });
});
