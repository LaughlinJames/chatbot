const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/chat-log.json');

function logChatEntry(prompt, response) {
  const entry = {
    timestamp: new Date().toISOString(),
    messages: [
      { role: 'user', content: prompt },
      { role: 'assistant', content: response }
    ]
  };

  fs.appendFile(logFile, JSON.stringify(entry) + '\n', err => {
    if (err) console.error('Failed to log chat:', err);
  });
}

module.exports = { logChatEntry };
