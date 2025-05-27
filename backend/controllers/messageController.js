const { callGPT } = require("../services/openaiService");

const greeting = `Hi, I'm a Chat Bot. What can I help you with today?`;

async function handleMessage(req, res) {
  const content = req.body.message;

  if (content.trim() === "") {
    return res.status(400).json({ error: "Empty message" });
  }
  
  const response = await callGPT(content);
  return res.json({ message: response });
}

module.exports = { handleMessage };
