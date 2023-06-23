/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import { generate } from './openai.js';
import { initiateChat, callAzureChatCompletionAPI, initiateSynonymChat } from './azure.js';
import { readBlockConfig } from '../../scripts/lib-franklin.js';

function renderHero(block_name, content) {
  const html = `
  ${content.map((item) => `
      <img loading="lazy" alt="" type="image/jpeg" src=${item.image} width="200" height="300">
      <h1>${item.text}</h1>
      <hr>
      `).join('')}
  `;
  return html;
}

function renderTable(block_name, content) {
  const html = `
  <table border="1">
  <tr>
      <td colspan="2" style="background-color: #ff8012; color: #ffffff;  height:23px;">${block_name}</td>
  </tr>
  ${content.map((item) => `
    <tr>
    <td>
      <img loading="lazy" alt="" type="image/jpeg" src=${item.image} width="200" height="300">
    </td>
    <td>${item.text}</td>
    </tr>
    `).join('')}
  </table>
  <hr>
  `;

  return html;
}

const blocks_renderer = {
  hero: renderHero,
  cards: renderTable,
  columns: renderTable,
  carousel: renderTable,
};

const templates = {
  default: {
    webpage: [
      { hero: { count: 1, text_size: 20 } },
      { cards: { count: 5, text_size: 30 } },
      { columns: { count: 4, text_size: 50 } },
      { carousel: { count: 4, text_size: 20 } },
    ],
    poster: [
      { hero: { count: 1, text_size: 20 } },
      { columns: { count: 4, text_size: 50 } },
    ],
    brochure: [
      { cards: { count: 6, text_size: 50 } },
    ],
    pamphlet: [
      { hero: { count: 1, text_size: 20 } },
      { cards: { count: 5, text_size: 60 } },
    ],
  },
  verbose: {
    webpage: [
      { hero: { count: 1, text_size: 10 } },
      { cards: { count: 8, text_size: 60 } },
      { columns: { count: 5, text_size: 100 } },
      { carousel: { count: 5, text_size: 20 } },
    ],
    poster: [
      { hero: { count: 1, text_size: 50 } },
      { columns: { count: 6, text_size: 70 } },
    ],
    brochure: [
      { cards: { count: 8, text_size: 80 } },
    ],
    pamphlet: [
      { hero: { count: 1, text_size: 30 } },
      { cards: { count: 5, text_size: 80 } },
    ],
  },
  concise: {
    webpage: [
      { hero: { count: 1, text_size: 10 } },
      { cards: { count: 3, text_size: 15 } },
      { columns: { count: 2, text_size: 20 } },
      { carousel: { count: 3, text_size: 10 } },
    ],
    poster: [
      { hero: { count: 1, text_size: 10 } },
      { columns: { count: 2, text_size: 20 } },
    ],
    brochure: [
      { cards: { count: 4, text_size: 20 } },
    ],
    pamphlet: [
      { hero: { count: 1, text_size: 10 } },
      { cards: { count: 3, text_size: 30 } },
    ],
  },

};

export default function decorate(block) {
  let clipboardData = '';
  const cfg = readBlockConfig(block);
  block.innerHTML = `


  <div id="container">
    <h4>Franklin Authoring Copilot</h4>
    <form id="myForm">
      <label for="prompt">What do you wish to create?</label>
      <input type="text" id="prompt" required>

      <button type="submit">Submit</button>
    </form>
  </div>

  <div id="result">
    <div id="loading">
      AI at work
    </div>
    <div id="gif">
      <img src="https://i.pinimg.com/originals/ca/a4/44/caa44463bac0ceaf3e5b5a1a227cdce6.gif"
        height="78px" width="90px"></img>
    </div>
    <div id="buttons">
      <button id="copy">Copy to Clipboard</button>
      <button id="regenerate">Regenerate</button>
    </div>
  </div>

  <div id="preview">
  </div>
    `;

  document.getElementById('copy').addEventListener('click', async () => {
    const data = [new ClipboardItem({ [clipboardData.type]: clipboardData })];
    navigator.clipboard.write(data);
  });

  document.getElementById('regenerate').onclick = () => {
    document.getElementById('myForm').submit();
  };

  document.getElementById('container').style.display = 'flex';
  document.getElementById('container').style.flexDirection = 'column';
  document.getElementById('container').style.textAlign = 'center';
  document.getElementById('result').style.display = 'none';

  document.getElementById('myForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission
    document.getElementById('container').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('buttons').style.display = 'none';

    const myInterval = setInterval(() => {
      document.getElementById('loading').innerHTML = `${document.getElementById('loading').innerHTML}...`;
    }, 200);

    const myInterval2 = setInterval(() => {
      document.getElementById('loading').innerHTML = 'AI at work';
    }, 2000);

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
        content: `"${respContent.text_adjective}"`,
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
