/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
import { generate } from './openai.js';
import { initiateChat, callAzureChatCompletionAPI } from './azure.js';
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
  webpage: [
    { hero: { count: 1, text_size: 10 } },
    { cards: { count: 3, text_size: 20 } },
    { columns: { count: 2, text_size: 30 } },
    { carousel: { count: 3, text_size: 10 } },
  ],
  poster: [
    { hero: { count: 1, text_size: 10 } },
    { columns: { count: 2, text_size: 30 } },
  ],
  brochure: [
    { cards: { count: 4, text_size: 30 } },
  ],
  pamphlet: [
    { hero: { count: 1, text_size: 10 } },
    { cards: { count: 3, text_size: 50 } },
  ],
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

  document.getElementById('copy').addEventListener('click', async (event) => {
    const data = [new ClipboardItem({ [clipboardData.type]: clipboardData })];
    navigator.clipboard.write(data);
  });

  document.getElementById('regenerate').onclick = function () {
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
    const response = await callAzureChatCompletionAPI(conversation);
    conversation.push(response);
    console.log(`[copilot] Parsed Prompt ${response.content}`);
    const respContent = JSON.parse(response.content);
    console.log(`[copilot] Prompt parsed to JSON ${JSON.stringify(respContent, null, 2)}`);
    const ingridients = templates[respContent.template];
    let preview_html = '';

    console.log(`[copilot]Generating ${respContent.template} for the topic ${respContent.topic} `);
    for (let i = 0; i < ingridients.length; i += 1) {
      const block_name = Object.keys(ingridients[i])[0];
      console.log(`[copilot] Generating block ${block_name}...`);
      const content = await generate(respContent.topic, ingridients[i][block_name], cfg);
      console.log(`[copilot] Generated content for block ${block_name} as follows ${JSON.stringify(content, null, 2)}`);

      if (content) {
        preview_html += blocks_renderer[block_name](block_name, content);
      }
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
