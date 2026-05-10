import { Telegraf, Context } from 'telegraf';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { estimateMacrosFromImage } from '../ai/gemini';
import { downloadAndCompressImage, cleanupTempFile } from '../services/image';

import { message } from 'telegraf/filters';

export const bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome to Food Macro Tracker Bot! 🥗\n\nSend me a photo of your food, and I will estimate its macronutrients and calories for you. 📸🍔');
});

bot.help((ctx) => {
  ctx.reply('Commands:\n/start - Start the bot\n\nJust send a photo of your food to get started!');
});

bot.on(message('photo'), async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const msg = await ctx.reply('Processing your food image... ⏳');

  let tempFilePath: string | null = null;
  try {
    const photos = ctx.message.photo;
    // Get the highest resolution photo
    const fileId = photos[photos.length - 1].file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);

    tempFilePath = await downloadAndCompressImage(fileLink.toString());

    const estimation = await estimateMacrosFromImage(tempFilePath, 'image/jpeg');



    const foodsList = estimation.foods.map((food) => `- ${food}`).join('\n');

    const replyText = 
      `🍽️ *Food detected:*\n${foodsList}\n\n` +
      `🔥 *Calories:* ${estimation.calories} kcal\n` +
      `🥩 *Protein:* ${estimation.protein}g\n` +
      `🍚 *Carbs:* ${estimation.carbs}g\n` +
      `🥑 *Fat:* ${estimation.fat}g\n\n` +
      `*Confidence:* ${estimation.confidence.charAt(0).toUpperCase() + estimation.confidence.slice(1)}`;

    await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined, replyText, {
      parse_mode: 'Markdown',
    });
  } catch (error) {
    logger.error({ error }, 'Error processing photo');
    await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, undefined, 'Sorry, I encountered an error analyzing your food. Please try again.');
  } finally {
    if (tempFilePath) {
      cleanupTempFile(tempFilePath);
    }
  }
});

// Error handling
bot.catch((err, ctx) => {
  logger.error({ error: err }, `Ooops, encountered an error for ${ctx.updateType}`);
});
