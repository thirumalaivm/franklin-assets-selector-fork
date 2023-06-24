/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import template from './copilot-template.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';
import { wait } from './utils.js';
import { executePrompt } from './pipeline.js';

// Function to append a message to the chat history
function appendMessage(message, chatHistory) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  chatHistory.appendChild(messageElement);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Function to send a user message
async function sendUserMessage(messageInput, chatHistory) {
  const message = messageInput.value.trim();

  if (message !== '') {
    appendMessage(`You: ${message}`, chatHistory);
    await wait(500);
    appendMessage('Copilot: Aye Aye Captain...', chatHistory);
    // Handle the message (e.g., send it to an AI model for processing)
    // ... Your code here ...
    messageInput.value = '';
  }
}

// Function to send a user message
function sendSystemMessage(messageInput, chatHistory) {
  const message = messageInput.trim();
  if (message !== '') {
    appendMessage(`Copilot: ${message}`, chatHistory);
  }
}

export default function decorate(block) {
  const linkTag = document.createElement('link');
  linkTag.setAttribute('rel', 'stylesheet');
  linkTag.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  document.head.appendChild(linkTag);
  const clipboardData = '';
  const cfg = readBlockConfig(block);
  let prompt = '';
  block.innerHTML = template();

  const chatHistory = block.querySelector('#chat-history');
  const messageInput = block.querySelector('#message-input');
  const sendButton = block.querySelector('#send-button');
  const previewStage = block.querySelector('.preview-stage');
  const placeholderAnimation = block.querySelector('.placeholder-animation');

  sendButton.addEventListener('click', async () => {
    prompt += messageInput.value;
    sendUserMessage(messageInput, chatHistory);
    placeholderAnimation.classList.add('visible');
    const generatedBlocksMarkup = await executePrompt(prompt, cfg);
    placeholderAnimation.classList.remove('visible');
    console.log(`[copilot]${generatedBlocksMarkup}`);
    previewStage.innerHTML = generatedBlocksMarkup;
    sendSystemMessage('Done! Please take a look.', chatHistory);
  });
}
