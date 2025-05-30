// /backend/apiManagementLayer/requestQueue.js
const queue = [];
let isProcessing = false;
const RATE_LIMIT = 4; // Firefly allows 4 requests per minute
const INTERVAL = 60_000 / RATE_LIMIT; // ~15 seconds per request

function enqueueRequest(requestFn) {
  return new Promise((resolve, reject) => {
    queue.push({ requestFn, resolve, reject });
    processQueue();
  });
}

function processQueue() {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const { requestFn, resolve, reject } = queue.shift();

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
