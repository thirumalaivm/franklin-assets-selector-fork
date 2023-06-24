/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import template from './copilot-template.js';
import { generate } from './openai.js';
import { initiateChat, callAzureChatCompletionAPI, initiateSynonymChat } from './azure.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  let clipboardData = '';
  const cfg = readBlockConfig(block);
  block.innerHTML = template();

    // Get the input value
    const promptStr = document.getElementById('prompt').value;
    // Prepare chat api
    console.log('[copilot] Initiate chat with Azure to train it to parse prompt to JSON');
    const conversation = await initiateChat();
    console.log('[copilot] Chat initiated');
    // Call chat api
    conversation.push({
      role: 'user',
      content: `Parse and return only the JSON representation for "${promptStr}" without anything else`,
    });
    console.log('[copilot] Call chat api to parse prompt to JSON');
    let response = await callAzureChatCompletionAPI(conversation);
    conversation.push(response);
    console.log(`[copilot] Parsed Prompt ${response.content}`);
    const respContent = JSON.parse(response.content);
    console.log(`[copilot] Prompt parsed to JSON ${JSON.stringify(respContent, null, 2)}`);

    let text_adjective = 'default';
    if (respContent.text_adjective && respContent.text_adjective != null) {
      // Prepare synonym chat api
      console.log('[copilot] Initiate Synonym chat with Azure to train it to get prescribed vocab');
      const synonym_conversation = await initiateSynonymChat();
      console.log('[copilot] Synonym Chat initiated');
      console.log(synonym_conversation);

      // Call chat api
      synonym_conversation.push({
        role: 'user',
        content: `Which bucket does "${respContent.text_adjective} text" belong to? Answer in one word only.`,
      });
      console.log('[copilot] Call chat api to get synonym');
      response = await callAzureChatCompletionAPI(synonym_conversation);
      console.log(response);
      synonym_conversation.push(response);
      console.log(`[copilot] Chat Response Synonym ${response.content}`);

      text_adjective = response.content || text_adjective;
      if (text_adjective.toLowerCase().includes('verbose')) {
        text_adjective = 'verbose';
      } else if (text_adjective.toLowerCase().includes('concise')) {
        text_adjective = 'concise';
      }
    }
    respContent.text_adjective = text_adjective;

    let image_adjective = '';
    if (respContent.image_adjective && respContent.image_adjective != null) {
      image_adjective = respContent.image_adjective;
    }

    let image_tone = '';
    if (respContent.image_tone && respContent.image_tone != null) {
      image_tone = respContent.image_tone;
    }

    console.log(`[copilot]Here's the normalized parsed prompt ${JSON.stringify(respContent, null, 2)}`);
    const generationConfig = {
      image_adjective,
      image_tone,
    };

    const ingridients = templates[text_adjective][respContent.template];
    let preview_html = '';

    console.log(`[copilot]Generating ${respContent.template} for the topic ${respContent.topic} `);
    const tasks = [];
    const blocks = [];
    for (let i = 0; i < ingridients.length; i += 1) {
      const block_name = Object.keys(ingridients[i])[0];
      console.log(`[copilot] Generating block ${block_name}...`);
      tasks.push(generate(respContent.topic, ingridients[i][block_name], generationConfig, cfg));
      blocks.push(block_name);
    }

    const results = await Promise.all(tasks);
    for (let i = 0; i < results.length; i += 1) {
      console.log(`[copilot] Generated content for block ${blocks[i]} as follows ${JSON.stringify(results[i], null, 2)}`);
      preview_html += blocks_renderer[blocks[i]](blocks[i], results[i]);
    }

    document.getElementById('loading').style.display = 'none';
    document.getElementById('gif').style.display = 'none';
    document.getElementById('buttons').style.display = 'block';

    document.getElementById('preview').innerHTML = preview_html;
    clipboardData = new Blob([preview_html], { type: 'text/html' });

    clearInterval(myInterval);
    clearInterval(myInterval2);
  });
}
