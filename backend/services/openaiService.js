// services/openaiService.js
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const apiKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
const axios = require('axios');
const { logSystemEvent } = require('../services/loggingService'); // handles logging system events

async function callGPT(chatMessages) {
  try {
    const response = await axios.post('http://localhost:3000/api/openai/chat', {
      messages: chatMessages,
      model: 'gpt-3.5-turbo'
    });

    return response.data.message;
  } catch (error) {
    console.error('Proxy Error:', error.response?.data || error.message);
    return 'There was a problem communicating with the language model.';
  }
}

async function isImageRequestViaLLM(prompt) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: 'system',
        content: "You are a strict classifier that answers ONLY with 'yes' or 'no'. Do not explain. If the user is asking for a generated image, say 'yes'. If not, say 'no'."
      },
      {
        role: 'user',
        content: `Is the user asking to generate an image with this prompt: "${prompt}"`
      }
    ],
    temperature: 0  // ensure deterministic output
  });

  const answer = response.data.choices[0].message.content.trim().toLowerCase();
  logSystemEvent('ClassifierResult', { 
    prompt, 
    classifierAnswer: answer 
  });

  if (answer !== "yes" && answer !== "no") {
    logSystemEvent('ClassifierUnexpectedAnswer', {
      prompt,
      rawAnswer: answer
    });
    return false;
  }

  return answer === "yes";
}

async function generateImageCaption(prompt) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: 'system',
        content: "You are a helpful assistant that rewrites image prompts into short, natural-sounding captions. Example: 'Prompt: a cat in a space suit' → 'Here’s an image of a cat in a space suit.'"
      },
      {
        role: 'user',
        content: `Prompt: ${prompt}`
      }
    ],
    temperature: 0.7
  });

  return response.data.choices[0].message.content.trim();
}

module.exports = { 
  callGPT, 
  isImageRequestViaLLM,
  generateImageCaption
};
// This module provides functions to interact with OpenAI's API, including calling the GPT model and checking if a prompt is an image request.
