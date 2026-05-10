import { bot } from './bot/telegram';
import { startServer } from './server';
import { logger } from './utils/logger';

async function main() {
  try {

    // Start fastify server (health checks)
    await startServer();

    // Start bot
    bot.launch(() => {
      logger.info('Telegram bot started successfully');
    });

    // Enable graceful stop
    process.once('SIGINT', () => {
      bot.stop('SIGINT');
      process.exit(0);
    });
    process.once('SIGTERM', () => {
      bot.stop('SIGTERM');
      process.exit(0);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start application');
    process.exit(1);
  }
}

main();
