import { FastifyInstance } from 'fastify';
import { URLS } from '../contants';
import { Room, RoomLogic } from '../domain/room';
import { IdParamsSchema, RoomBodySchema } from '../schemas';

export async function roomsRoutes(fastify: FastifyInstance, roomService: RoomLogic) {
  fastify
    .route<{ Body: Room }>({
      url: `/${URLS.ROOMS}`,
      method: 'POST',
      schema: {
        body: RoomBodySchema,
      },
      onRequest: fastify.basicAuth,
      handler: async (request, response) => {
        const result = await roomService.add(request.body);
        if (result) response.status(201).send({ success: true });
        else response.status(400).send({ success: false });
      },
    })
    .route<{ Params: { id: Room['id'] } }>({
      url: `/${URLS.ROOMS}/:id`,
      method: 'GET',
      schema: {
        params: IdParamsSchema,
      },
      onRequest: fastify.basicAuth,
      handler: async (request, response) => {
        const room = await roomService.get(request.params.id);
        if (room) response.send(room);
        else response.status(404).send('not found');
      },
    });
}
