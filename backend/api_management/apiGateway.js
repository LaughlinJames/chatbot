const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const { isImageRequestViaLLM, generateImageCaption } = require('../services/openaiService'); // handles LLM requests
const { logChatEntry } = require('../services/loggingService'); // handles logging chat entries and responses 
const { generateImageWithFirefly } = require('../services/fireflyService'); // handles image generation with Adobe Firefly

const { enqueueRequest } = require('./requestQueue');


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
  // using the LLM to classify the intent
  // This is a more robust way to determine if the user wants an image
  // rather than relying on simple keyword detection
  const isImageRequest = await isImageRequestViaLLM(userInput);


  if (isImageRequest) {
    try {
      const imageObject = await enqueueRequest(
        () => generateImageWithFirefly(userInput), 
        {
          prompt: userInput,
        }
      );
      
      const imageUrl = imageObject.outputs[0].image.url;
      const imageSeed = imageObject.outputs[0].seed;
  
      const responseMessage = await generateImageCaption(userInput);

      const responseObject = {
        message: responseMessage,
        imageUrl: imageUrl,
        seed: imageSeed
      };
  
      // ✅ Store and log the full object, not just the message string
      logChatEntry(userInput, responseObject);
      chatHistory.push({ role: 'assistant', content: JSON.stringify(responseObject) });
  
      return res.json({
        message: responseObject.message,
        image: responseObject.imageUrl,
        seed: responseObject.seed
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
    const response = await requestQueue.enqueueRequest('openai', () =>
      openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
      })
    );
    
  
    let reply = response.data.choices[0].message.content.trim();
  
    // Intercept LLM false disclaimers and override
    if (
      /i\s(can('|’)t|cannot|unable)\s+(generate|create|make)\s+(images?|pictures?|visuals?)/i.test(reply)
    ) {
      reply = "Yes, I can generate images. Just ask me what you'd like to see!";
    }
  
    chatHistory.push({ role: 'assistant', content: reply });
    logChatEntry(userInput, reply);
  
    res.json({ message: reply });
  
  } catch (err) {
    console.error('[API Proxy Error]', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to contact OpenAI API' });
  }
  
});

// Classify if a prompt is an image request
router.post('/openai/classify-image-intent', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing message' });
  }

  try {
    const isImage = await isImageRequestViaLLM(message);
    res.json({ isImage });
  } catch (err) {
    console.error('[Intent Classification Error]', err.message);
    res.status(500).json({ error: 'Failed to classify intent' });
  }
});

module.exports = router;
