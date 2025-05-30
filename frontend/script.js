const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let isChatbotTyping = false;
let typingIntervalId = null;
let typingIndicatorMessage = 'Typing';

function displayUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerText = message;
    chatBody.appendChild(userMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayChatbotMessage(message, imageUrl = null) {
    console.log('Chatbot response:', message);
    console.log('Image URL:', imageUrl);
    if (isChatbotTyping) {
        // Remove the typing indicator when bot responds
        clearInterval(typingIntervalId);
        const typingIndicator = chatBody.querySelector('.typing-indicator');
        if (typingIndicator) {
        chatBody.removeChild(typingIndicator);
        }
        isChatbotTyping = false;
    } 

    const chatbotMessage = document.createElement('div');
    chatbotMessage.className = 'chatbot-message';
    chatbotMessage.innerText = message;

    // If an image is provided, append it inside the same chatbot message
    if (imageUrl) {
      const atag = document.createElement('a');
      atag.href = imageUrl;
      atag.target = '_blank'; // Open in new tab
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = 'Generated image';
      img.className = 'chatbot-image';
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.marginTop = '8px';
      chatbotMessage.appendChild(document.createElement('br'));
      chatbotMessage.appendChild(atag);
      atag.appendChild(img);
    }

    chatBody.appendChild(chatbotMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayTypingIndicator(type = "text") {
    if (!isChatbotTyping) {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message typing-indicator';

        typingIndicatorMessage = (type === "image") ? "Generating image" : "Typing";
        typingIndicator.innerText = typingIndicatorMessage;

        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        isChatbotTyping = true;

        typingIntervalId = setInterval(() => {
            if (typingIndicatorMessage.endsWith("...")) {
                typingIndicatorMessage = typingIndicatorMessage.slice(0, -3);
            } else {
                typingIndicatorMessage += ".";
            }
            typingIndicator.innerText = typingIndicatorMessage;
        }, 400);
    }
}

async function sendMessage() {
    // Ignore empty messages
    const message = userInput.value.trim();
    if (message === '') {
        return;
    }
    displayUserMessage(message);

    userInput.value = '';

    try {
        // Display the typing indicator while waiting for OpenAI or Firefly's response
        const isImageIntent = await classifyImageIntent(message);
        displayTypingIndicator(isImageIntent ? "image" : "text");

        const response = await fetch('http://127.0.0.1:3000/api/openai/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
            console.log(response.status);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const chatbotResponse = data.message;
        const imageUrl = data.image;

        displayChatbotMessage(chatbotResponse, imageUrl);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function classifyImageIntent(prompt) {
    try {
      const response = await fetch('http://127.0.0.1:3000/api/openai/classify-image-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
  
      const data = await response.json();
      return data.isImage === true;
    } catch (err) {
      console.error('Intent classification failed:', err);
      return false; // Fallback to text typing indicator
    }
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

displayChatbotMessage(`Hi, I'm a Chat Bot. What can I help you with today?`);