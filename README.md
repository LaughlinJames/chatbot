# Chat Bot using Node.js, Express, and OpenAI API

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![HTML](https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Openai](https://img.shields.io/badge/Openai-404D59?style=for-the-badge)
![Adobe Firefly](https://img.shields.io/badge/Adobe-Firefly-FE0F00?logo=adobe&logoColor=white)

## Description

This is a chat bot built with Node.js and Express, integrated with OpenAI's API to provide natural language processing capabilities and Adobe's Firefly API for image generation. The bot can engage in conversations with users, answer questions, provide responses based on the context of the conversation, and generate images in response to user requests.

## Features

- Natural Language Processing (NLP) using OpenAI's API.
- Image processing using Adobe's Firefy API.
- Interactive conversations with users.
- Ability to answer questions and provide context-aware responses.
- Ability to respond to user prompts with images.
- Simulated API management layer for 
  - Context management
  - Logging
  - Routing requests to the appropriate API (OpenSSL or Firefly)
  - Future features such as request queues, performance monitoring, and policy enforcement


## Examples
![image](https://github.com/LaughlinJames/chatbot/blob/main/sample-images/Image%20Generation.png)
![image](https://github.com/LaughlinJames/chatbot/blob/main/sample-images/NLP%20Request.png)


## Installation

1. Clone the repository:

```bash
git clone https://github.com/LaughlinJames/chatbot.git
cd chat-bot
```

2. Install dependencies:

```bash
cd backend
npm install
```

3. Obtain OpenAI API Key:

Sign up for an account at OpenAI.
Get your API key from the OpenAI dashboard.
Create a .env file in the /backend directory and add your API key:
```dotenv
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
FIREFLY_SERVICES_CLIENT_ID=<YOUR_FIRE_FLY_SERVICES_CLIENT_ID>
FIREFLY_SERVICES_CLIENT_SECRET=<YOUR_FIRE_FLY_SERVICES_CLIENT_SECRET>
```
You may need to change the model in the backend/services/openaiService.js file depending on availability
```javascript
const response = await openai.createChatCompletion({
      // Switch to different models if necessary
      // model: "gpt-3.5-turbo",
      model: "gpt-4",
      messages: messages,
    });
```


## Usage
Run the following command to start the chat bot server from the backend:
```bash
cd backend
npm start
```
And the index.html file should open in your browser


## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
This project was inspired by 
- the capabilities of OpenAI's API
- the capabilities of Adobe's Firefly API
- Tyler Oneil's chatbot (https://github.com/tyleroneil72/chat-bot)


