const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const { logChatEntry } = require('./logger'); 

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post('/openai/chat', async (req, res) => {
  const { messages, model = "gpt-3.5-turbo" } = req.body;

  // Optional: Log or filter here
  console.log(`[API Proxy] Forwarding ${messages.length} messages to OpenAI`);

  try {
    const response = await openai.createChatCompletion({
      model,
      messages,
    });

    const reply = response.data.choices[0].message.content;

    // ✅ Log the last user message and assistant response
    const userMessage = messages.findLast(msg => msg.role === 'user')?.content || '[No user message found]';
    logChatEntry(userMessage, reply);
    
    res.json({
      message: reply
    });
  } catch (err) {
    console.error('[API Proxy Error]', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to contact OpenAI API' });
  }
});

module.exports = router;
