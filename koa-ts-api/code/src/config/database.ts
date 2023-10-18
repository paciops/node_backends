export default {
  client: 'pg',
  connection: {
    port: Number.parseInt(process.env.DB_PORT || '5432', 10),
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};
