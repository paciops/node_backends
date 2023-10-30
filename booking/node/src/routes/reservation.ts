import { FastifyInstance } from 'fastify';
import { URLS } from '../contants';
import { Reservation, ReservationLogic } from '../domain';
import { IdParamsSchema, ReservationBodySchema } from '../schemas';

export async function reservationsRoutes(fastify: FastifyInstance, reservationService: ReservationLogic) {
  fastify
    .route<{ Body: Reservation }>({
      url: `/${URLS.RESERVATIONS}`,
      method: 'POST',
      schema: {
        body: ReservationBodySchema,
      },
      onRequest: fastify.basicAuth,
      handler: async (request, response) => {
        const reservation = request.body;
        const { success, reason } = await reservationService.add(reservation, request.user);
        if (success) response.status(201).send({ success: true });
        else response.status(400).send({ success: false, reason });
      },
    })
    .route<{ Params: { id: number } }>({
      url: `/${URLS.RESERVATIONS}/:id`,
      method: 'GET',
      schema: {
        params: IdParamsSchema,
      },
      onRequest: fastify.basicAuth,
      handler: async (request, response) => {
        const { id } = request.params;
        const reservation = await reservationService.get(id);
        if (reservation) response.send(reservation);
        else response.status(404).send('not found');
      },
    });
}
