/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const API_KEY = '64087d1089dc4308b9a3fd079ac0fab2';
const MAX_RETRIES = 3;

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function callAzureChatCompletionAPI(conversation) {
  let retries = 0;
  console.log('Calling Azure Chat Completion API...');
  const AZURE_CHAT_API = `https://eastus.api.cognitive.microsoft.com/openai/deployments/satyam-oai-deployment/chat/completions?api-version=2023-03-15-preview&api-key=${API_KEY}`;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const payload = {};
  payload.messages = conversation;
  requestOptions.body = JSON.stringify(payload);

  while (retries < MAX_RETRIES) {
    const response = await fetch(AZURE_CHAT_API, requestOptions);
    if (response.ok) {
      const data = await response.json();
      // console.log(`Here's the Azure Chat Completion API Response: ${JSON.stringify(data, null, 2)}`);
      return data.choices[0].message;
    }
    retries += 1;
    const delay = 1000;
    console.log(`Azure Chat Completion API Retrying in ${delay}ms...`);
    await wait(delay);
  }
  throw new Error('Azure Chat Completion API Max retries reached. Giving up!!');
}

async function initiateChat() {
  console.log('Initiating chat...');
  const conversation = [];

  const firstPrompt = 'The json representation of the sentence "Create a travel website of Forts in Jaipur with concise text and vivid images in sepia tone" '
  + 'is {"topic": "Forts in Jaipur", "template": "website", "action": "create", "text_adjective":"concise", "image_adjective":"vivid", "image_tone":"sepia"}. Similarly, The json representation '
  + 'of the sentence "Build a poster on tourist places in Ladakh containing less words and bright pictures" '
  + 'is {"topic": "Tourist places in Ladakh", "template": "poster", "action": "build", "text_adjective":"less", "image_adjective":"bright", "image_tone" : null} '
  + 'Now, return the JSON for "Create a travel website of Forts in New Delhi having colourful pics and verbose text".';
  conversation.push({
    role: 'system',
    content: firstPrompt,
  });
  const firstResponse = await callAzureChatCompletionAPI(conversation);
  conversation.push(firstResponse);

  console.log('Chat initiated.');
  return conversation;
}

async function initiateSynonymChat() {
  console.log('Preparing synonym chat');

  const conversation = [];

  const firstPrompt = `
  Whenever I say some synonym of "verbose" just return "verbose".
  For e.g. when I say "wordy" then return "verbose".
  And whenever I say some synonym of "concise" just return "concise".
  For e.g. when I say "brief" then return "concise".
  Let's get started.'
  `;
  conversation.push({
    role: 'system',
    content: firstPrompt,
  });
  const firstResponse = await callAzureChatCompletionAPI(conversation);
  conversation.push(firstResponse);

  console.log('Synonym Chat initiated.');
  return conversation;
}

export { callAzureChatCompletionAPI, initiateChat, initiateSynonymChat };
