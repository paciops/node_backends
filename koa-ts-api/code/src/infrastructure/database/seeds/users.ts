/* eslint-disable import/first */
import { config } from 'dotenv';

console.log({ path: process.argv[2] });
config({ path: process.argv[2] });

import { Client } from 'pg';
import users from '../../../../../users.json';
import defaults from '../../../config/database';
import node from '../../../config/node';

console.log({ env: node.env, ...defaults });

(async () => {
  if (node.env !== 'production') {
    const client = new Client(defaults.connection);
    try {
      await client.connect(); // gets connection
      for (const user of users) {
        const result = await client.query(
          `INSERT INTO "user" ("id", "email", "username","created_at")
           VALUES ($1, $2, $3, $4)`,
          [user.id, user.email, user.username, user.created_at]
        );
        console.log({ result });
      }
    } catch (error) {
      console.error(error);
    } finally {
      await client.end(); // closes connection
    }
  }
})();
