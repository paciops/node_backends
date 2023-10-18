import { Knex } from 'knex';
import { UserLogic } from '../../interface/logic/index';
import { User } from '../../interface/models/index';
import tables from '../../config/tables';

export class UserEntity implements UserLogic {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  usersClient() {
    return this.knex<User>(tables.user);
  }

  async getById(id: number) {
    const user = await this.usersClient().where('id', id).first();
    if (user === undefined) throw new Error(`User with id = ${id} not found`);
    return user;
  }
}
