const axios = require('axios'); // For making HTTP requests
const qs = require('qs');



// Function to retrieve access token
async function retrieveAccessToken() {
    const data = qs.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.FIREFLY_SERVICES_CLIENT_ID,
      client_secret: process.env.FIREFLY_SERVICES_CLIENT_SECRET,
      scope: 'openid,AdobeID,session,additional_info,read_organizations,firefly_api,ff_apis',
    });
  
    const config = {
      method: 'post',
      url: 'https://ims-na1.adobelogin.com/ims/token/v3',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: data,
    };
  
    try {
      const response = await axios.request(config);
      return response.data.access_token;
    } catch (err) {
      console.error('[Token Request Error]', err.response?.data || err.message);
      throw err;
    }
  }
  
  // Function to generate image based on the prompt
  async function generateImageWithFirefly(prompt) {
    const accessToken = await retrieveAccessToken();

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-api-key': process.env.FIREFLY_SERVICES_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    };
  
    const data = {
      prompt: prompt,
    };
  
    const config = {
      method: 'post',
      url: 'https://firefly-api.adobe.io/v3/images/generate',
      headers: headers,
      data: data,
    };
  
    // console.log('[Firefly Request Config]', JSON.stringify(config, null, 2));
    const response = await axios.request(config);
    // console.log('Response:', response.data);
    return response.data;
  }

  module.exports = { generateImageWithFirefly };