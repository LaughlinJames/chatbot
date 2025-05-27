// services/openaiService.js
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const apiKey = process.env.API_KEY;
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
const axios = require('axios');

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

module.exports = { callGPT };
