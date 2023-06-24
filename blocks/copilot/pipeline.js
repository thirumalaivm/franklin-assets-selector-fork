/* eslint-disable no-console */
import { initiateChat, callAzureChatCompletionAPI, initiateSynonymChat } from './azure-openai.js';
import pageRecipes from './page-recipes.js';
import { generate } from './content-generator.js';
import { blocksRenderers } from './blocks-renderers.js';

async function executePrompt(prompt, cfg) {
  console.log('[pipeline] Initiate chat with Azure OpenAI to train it to parse prompt to JSON');
  const conversation = await initiateChat();
  console.log(`[pipeline] Azure OpenAI chat initiated ${JSON.stringify(conversation, null, 2)}`);

  conversation.push({
    role: 'user',
    content: `Parse and return only the JSON representation for "${prompt}" without anything else`,
  });
  let response = await callAzureChatCompletionAPI(conversation);
  conversation.push(response);
  const respContent = JSON.parse(response.content);
  console.log(`[pipeline] Prompt parsed to JSON ${JSON.stringify(respContent, null, 2)}`);

  let textAdjective = 'default';
  if (respContent.text_adjective && respContent.text_adjective !== null) {
    // Prepare synonym chat api
    console.log('[pipeline] Initiate Synonym chat with Azure OpenAI to train it to get text_adjective in prescribed vocab');
    const synonymConversation = await initiateSynonymChat();
    console.log(`[pipeline] Synonym chat initiated ${JSON.stringify(synonymConversation, null, 2)}`);

    // Call chat api
    synonymConversation.push({
      role: 'user',
      content: `Which bucket does "${respContent.textAdjective} text" belong to? Answer in one word only.`,
    });

    response = await callAzureChatCompletionAPI(synonymConversation);
    console.log(`[pipeline] Synonym chat response ${JSON.stringify(response, null, 2)}`);
    synonymConversation.push(response);

    textAdjective = response.content || textAdjective;
    if (textAdjective.toLowerCase().includes('verbose')) {
      textAdjective = 'verbose';
    } else if (textAdjective.toLowerCase().includes('concise')) {
      textAdjective = 'concise';
    }
  }
  respContent.text_adjective = textAdjective;

  let imageAdjective = '';
  if (respContent.image_adjective && respContent.image_adjective != null) {
    imageAdjective = respContent.image_adjective;
  }

  let imageTone = '';
  if (respContent.image_tone && respContent.image_tone != null) {
    imageTone = respContent.image_tone;
  }

  console.log(`[pipeline]Here's the normalized parsed prompt ${JSON.stringify(respContent, null, 2)}`);
  const generationConfig = {
    imageAdjective,
    imageTone,
  };

  const ingridients = pageRecipes[textAdjective][respContent.template];
  let generateBlocksMarkup = '';

  console.log(`[pipeline]Generating ${respContent.template} for the topic ${respContent.topic} `);
  const tasks = [];
  const blocks = [];
  for (let i = 0; i < ingridients.length; i += 1) {
    const blockName = Object.keys(ingridients[i])[0];
    console.log(`[pipeline] Generating block ${blockName}...`);
    tasks.push(generate(respContent.topic, ingridients[i][blockName], generationConfig, cfg));
    blocks.push(blockName);
  }

  const results = await Promise.all(tasks);
  for (let i = 0; i < results.length; i += 1) {
    console.log(`[copilot] Generated content for block ${blocks[i]} as follows ${JSON.stringify(results[i], null, 2)}`);
    generateBlocksMarkup += blocksRenderers[blocks[i]](blocks[i], results[i]);
  }

  return generateBlocksMarkup;
}

// eslint-disable-next-line import/prefer-default-export
export { executePrompt };
