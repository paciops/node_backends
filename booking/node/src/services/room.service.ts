import { request } from 'undici';
import { URLS } from '../contants';
import { Room, RoomLogic } from '../domain';

export const roomHttpService = (host: string): RoomLogic => {
  return {
    add(room) {
      throw new Error('Not implemented');
    },
    async get(id, options) {
      if (!options) throw new Error('with http service option must be defined');
      const { username, password } = options;

      if (!username) throw new Error('username must be defined');
      if (!password) throw new Error('password must be defined');

      const { statusCode, body } = await request(`${host}/${URLS.ROOMS}/${id}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        },
      });
      switch (statusCode) {
        case 200:
          const { id, beds } = (await body.json()) as Room;
          if (id !== undefined && beds !== undefined) return { id, beds };
          else throw new Error(`Malformed output`);
        case 404:
          return undefined;
        default:
          throw new Error(`Cannot handle status code ${statusCode}`);
      }
    },
    reset() {},
  };
};
