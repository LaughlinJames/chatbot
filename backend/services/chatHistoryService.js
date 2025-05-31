const fs = require('fs');
const path = require('path');

const historyDir = path.join(__dirname, '../data/chat_history');
if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir);

function getUserFile(userId) {
  return path.join(historyDir, `${userId}.json`);
}

function getHistory(userId) {
  const file = getUserFile(userId);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveMessage(userId, messageObj) {
  const history = getHistory(userId);
  history.push(messageObj);
  fs.writeFileSync(getUserFile(userId), JSON.stringify(history, null, 2));
}

function clearHistory(userId) {
  const file = getUserFile(userId);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

module.exports = { getHistory, saveMessage, clearHistory };
