import httpLoader from './modules/http/index';
import serverConfig from './config/server';

type ListenConfig = {
  port: number;
  hostname: string;
};

const start = async (config: ListenConfig): Promise<void> => {
  const app = await httpLoader();
  const server = app.listen(config.port);

  server.on('listening', () => {
    console.info(`Server started and is listening on ${config.hostname}:${config.port}`);
  });

  server.on('error', (err: unknown) => {
    console.error('Server did not start properly.', { err });

    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
};

start({ port: serverConfig.port, hostname: serverConfig.hostname });
