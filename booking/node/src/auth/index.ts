import { FastifyInstance, FastifyRequest } from 'fastify';
import { User } from '../domain';

type ValidationFunction = (username: string, password: string, request: FastifyRequest) => Promise<void | Error>;

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}

export const authorizationMongoDB = (app: FastifyInstance, collectionName = 'users'): ValidationFunction => {
  return async (username, password, request) => {
    const user = await app.mongo.db?.collection<User>(collectionName).findOne({ username, password });
    if (!user) return new Error('missing user');
    request.user = user;
    return;
  };
};

export const authorizationArray = (users: User[] = []): ValidationFunction => {
  return async (username, password, request) => {
    const userFound = users.find((user) => user.username === username && user.password === password);
    if (!userFound) return new Error('missing user');
    request.user = { username, password };
    return;
  };
};
