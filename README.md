# Telegram Food Macro Tracker Bot 🥗

A production-ready Telegram bot built with Node.js and TypeScript that estimates macronutrients from food photos using Google's Gemini Vision API.

## Features

- 📸 **Image Recognition**: Send a photo of your food, and the bot identifies the items.
- 📊 **Macro Estimation**: Estimates calories, protein, carbs, and fats.
- 💾 **Meal History**: Saves your daily meals in a local SQLite database.
- 📉 **Daily Summary**: Use `/summary` to get your total macros for the day.
- 🚀 **Docker Ready**: Fully containerized for easy deployment on Render, Railway, or VPS.

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Bot Framework**: Telegraf
- **AI**: Google GenAI API (Gemini 2.5 Flash)
- **Web Server**: Fastify (Health checks)
- **Database**: SQLite3
- **Image Processing**: Sharp

## Setup Instructions

### 1. Prerequisites
- Node.js (v20+)
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```
Edit `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
Start the bot in development mode:
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm start
```

## Docker Deployment

This bot is ready to be deployed using Docker.

```bash
# Build and run the containers
docker-compose up -d
```

The database will be persisted in the `./data` volume.

## Folder Structure

\`\`\`text
src/
├── ai/          # Gemini API integration
├── bot/         # Telegram handlers and commands
├── config/      # Environment variables and config
├── db/          # SQLite connection and queries
├── services/    # Image downloading and compression
├── utils/       # Logging and utilities
├── index.ts     # Main entry point
└── server.ts    # Fastify server (health check)
\`\`\`
