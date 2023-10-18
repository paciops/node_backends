export default {
  hostname: process.env.HOSTNAME || 'localhost',
  port: Number.parseInt(process.env.SERVER_PORT || '3000', 10),
  healthCheck: process.env.HEALTH_CHECK_PATH || '/health',
};
