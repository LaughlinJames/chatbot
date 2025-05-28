const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const { logChatEntry } = require('./logger'); // handles logging chat entries and responses 
const { generateImageWithFirefly } = require('../services/fireflyService');
const detectImageIntent = (prompt) => {
  return /image|illustration|draw|visualize|picture/i.test(prompt);
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Initialize chat history with a system message
// This will help maintain context across messages
// and ensure the chatbot behaves consistently
let chatHistory = [
  {
    role: 'system',
    content: "You are a helpful chatbot that responds concisely and like a human. Use prior messages to maintain context. Avoid disclaimers."
  }
];

router.post('/openai/chat', async (req, res) => {
 
  const userInput = req.body.message;
  if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
    return res.status(400).json({ error: 'Invalid or empty message' });
  }
  chatHistory.push({ role: 'user', content: userInput });

  // Decide whether to generate an image or respond with text
  const isImageRequest = detectImageIntent(userInput);

  if (isImageRequest) {
    try {
      const imageObject = await generateImageWithFirefly(userInput);
      const imageUrl = imageObject.outputs[0].image.url;
  
      const responseMessage = "Here is your generated image:";
  
      // console.log('[✅ RESPONSE TO FRONTEND]', {
      //   message: responseMessage,
      //   image: imageUrl
      // });
  
      // Log before returning
      logChatEntry(userInput, responseMessage);
      chatHistory.push({ role: 'assistant', content: responseMessage });
  
      return res.json({ 
        message: responseMessage, 
        image: imageUrl 
      });
  
    } catch (err) {
      const errorMsg = 'Failed to generate image. Please try again later.';
      console.error('[Firefly Error]', err.message);
      logChatEntry(userInput, errorMsg);
      chatHistory.push({ role: 'assistant', content: errorMsg });
  
      return res.status(500).json({ error: errorMsg });
    }
  }
   


  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatHistory,
    });

    const reply = response.data.choices[0].message.content;
    chatHistory.push({ role: 'assistant', content: reply });

    // Log
    logChatEntry(userInput, reply);

    res.json({ message: reply });
  } catch (err) {
    console.error('[API Proxy Error]', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to contact OpenAI API' });
  }
});

module.exports = router;
