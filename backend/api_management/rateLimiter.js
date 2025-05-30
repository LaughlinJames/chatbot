const limits = {
    firefly: { rpm: 4 },     // 4 requests per minute
    openai: { rpm: 20 }      // 20 requests per minute
  };
  
  const tokens = {}; // Service name -> timestamps of recent calls
  
  function ensureServiceInitialized(service) {
    if (!tokens[service]) {
      tokens[service] = [];
    }
  }
  
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  async function waitForSlot(service) {
    ensureServiceInitialized(service);
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = limits[service]?.rpm || 1;
  
    while (true) {
      // Filter out timestamps older than 1 minute
      tokens[service] = tokens[service].filter(ts => now - ts < windowMs);
  
      if (tokens[service].length < maxRequests) {
        tokens[service].push(Date.now());
        return; // Slot acquired
      }
  
      const waitTime = windowMs - (now - tokens[service][0]);
      await sleep(waitTime);
    }
  }
  
  module.exports = { waitForSlot };