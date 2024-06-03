const TelegramBot = require('node-telegram-bot-api');
const { Configuration, OpenAIApi } = require('openai');

// Replace with your own values
const TELEGRAM_TOKEN = '6570707210:AAFSYm1WTpyWuIQlxpMcQ-6ncebXLphjTMc';
const OPENAI_API_KEY = 'sk-proj-5nu3zNWf7ghZQ1L2yGrQT3BlbkFJzLG1PylRCLTXPwHV6eN6';

// Set up the OpenAI configuration
const openai = new OpenAIApi(new Configuration({
  apiKey: OPENAI_API_KEY,
}));

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Function to generate a design prompt using OpenAI
const generatePrompt = async (type) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Generate a creative and unique prompt for designing a ${type}.`,
      max_tokens: 50,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating prompt:', error);
    return 'Sorry, I could not generate a prompt at this time. Please try again later.';
  }
};

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! I can help you generate design prompts. Use /prompt followed by the type of design you need (e.g., logo, image, poster, illustration).');
});

// Handle the /prompt command
bot.onText(/\/prompt (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const type = match[1];
  const prompt = await generatePrompt(type);
  bot.sendMessage(chatId, prompt);
});

// Default message for unrecognized commands
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(chatId, 'I only recognize commands. Please use /start or /prompt followed by the type of design you need.');
  }
});
