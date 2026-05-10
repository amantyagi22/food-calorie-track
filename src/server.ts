import Fastify from 'fastify';
import { logger } from './utils/logger';
import { env } from './config/env';

export const server = Fastify({
  logger: false, // We use pino instance separately
});

server.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

export async function startServer() {
  try {
    const port = parseInt(env.PORT, 10);
    await server.listen({ port, host: '0.0.0.0' });
    logger.info(`Server listening on port ${port}`);
  } catch (err) {
    logger.error({ error: err }, 'Failed to start application');
    process.exit(1);
  }
}
