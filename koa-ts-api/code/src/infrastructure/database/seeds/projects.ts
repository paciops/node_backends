/* eslint-disable import/first */
import { config } from 'dotenv';

console.log({ path: process.argv[2] });
config({ path: process.argv[2] });

import { Client } from 'pg';
import projects from '../../../../../projects.json';
import defaults from '../../../config/database';
import node from '../../../config/node';

console.log({ env: node.env, ...defaults });

(async () => {
  if (node.env !== 'production') {
    const client = new Client(defaults.connection);
    try {
      await client.connect(); // gets connection
      for (const project of projects) {
        const result = await client.query(
          `INSERT INTO "project" ("id", "name", "user_id","created_at", "url", "app_secret")
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            project.id,
            project.name,
            project.user_id,
            project.created_at,
            project.url,
            project.app_secret,
          ]
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
