import { ErrorInterface } from './errorInterface';

export class NotFoundError extends Error implements ErrorInterface {
  name: string;

  message: string;

  constructor(name: string, message: string) {
    super();
    this.name = name;
    this.message = message;
  }
}
