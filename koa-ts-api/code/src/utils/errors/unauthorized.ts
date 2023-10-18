import { ErrorInterface } from './errorInterface';

export class UnauthorizedError extends Error implements ErrorInterface {
  name: string;

  message: string;

  constructor(message: string) {
    super();
    this.name = 'Unauthorized operation';
    this.message = message;
  }
}
