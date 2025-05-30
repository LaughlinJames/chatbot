// todo: fix bugs in failedRequests count 
// and totalResponseTime calculation

let totalRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;
let totalResponseTime = 0;

function logRequestStart() {
  totalRequests++;
  return Date.now(); // return start timestamp
}

function logRequestEnd(startTime, success = true) {
  const duration = Date.now() - startTime;
  totalResponseTime += duration;
  success ? successfulRequests++ : failedRequests++;
}

function getMetrics() {
    const avg = successfulRequests > 0
    ? totalResponseTime / successfulRequests
    : 0;
    const averageResponseTimeMs = Math.round(avg)
    
    return {
        totalRequests,
        successfulRequests,
        failedRequests,
        averageResponseTimeMs
    };
}

module.exports = {
  logRequestStart,
  logRequestEnd,
  getMetrics,
};