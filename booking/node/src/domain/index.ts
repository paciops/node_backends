export * from './reservation';
export * from './room';

export type Value<T> = T | Promise<T>;

export type User = { username: string; password: string };
