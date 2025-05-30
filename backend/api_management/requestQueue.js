// /backend/apiManagementLayer/requestQueue.js
const queue = [];
let isProcessing = false;
const RATE_LIMIT = 4; // Firefly allows 4 requests per minute
const INTERVAL = 60_000 / RATE_LIMIT; // ~15 seconds per request
const { logSystemEvent } = require('../services/loggingService'); // Adjust path as needed

function enqueueRequest(requestFn, metadata = {}) {
  logSystemEvent('enqueueRequest', metadata);
  return new Promise((resolve, reject) => {
    queue.push({ requestFn, resolve, reject, metadata });
    processQueue();
  });
}

function processQueue() {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const { requestFn, resolve, reject, metadata } = queue.shift();

  logSystemEvent('processQueue', metadata);

  requestFn()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      setTimeout(() => {
        isProcessing = false;
        processQueue();
      }, INTERVAL);
    });
}

module.exports = { enqueueRequest };
