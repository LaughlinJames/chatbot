const { callGPT } = require("../services/openaiService");


const greeting = `Hi, I'm a Chat Bot. What can I help you with today?`;

let chatHistory = [
  { role: 'system', content: "You are a helpful chatbot that responds concisely and like a human. Use prior messages to maintain context and avoid disclaimers." }
];

async function handleMessage(req, res) {
  const content = req.body.message;

  if (content.trim() === "") {
    return res.status(400).json({ error: "Empty message" });
  }
  
  chatHistory.push({ role: 'user', content: content });
  const response = await callGPT(chatHistory);
  chatHistory.push({ role: 'assistant', content: response });
  
  return res.json({ message: response });
}

module.exports = { handleMessage };
