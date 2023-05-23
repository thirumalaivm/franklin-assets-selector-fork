import { generate } from "./openai.js";
export default function decorate(block) {
  block.innerHTML = `
    <h1>Franklin Authoring Copilot</h1>

    <form id="myForm">
      <label for="blockSelect">Block:</label>
      <select id="blockSelect" required>
        <option value="">Select a block</option>
        <option value="cards">Cards</option>
        <option value="columns">Columns</option>
        <option value="carousel">Carousel</option>
      </select>

      <label for="topicInput">Topic:</label>
      <input type="text" id="topicInput" required>

      <label for="itemsInput">Items:</label>
      <input type="number" id="itemsInput" required>

      <label for="apiKeyInput">API Key:</label>
      <input type="text" id="apiKeyInput" required>

      <label for="tokenInput">Token:</label>
      <input type="text" id="tokenInput" required>

      <button type="submit">Submit</button>
    </form>
    <div id="result"></div>
    `;

  document.getElementById('myForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the input values
    const block = document.getElementById('blockSelect').value;
    const topic = document.getElementById('topicInput').value;
    const item_count = document.getElementById('itemsInput').value;
    const apiKeyInput = document.getElementById('apiKeyInput').value;
    const tokenInput = document.getElementById('tokenInput').value;
    const content = await generate(apiKeyInput, tokenInput, topic, item_count);
    console.log(content);
  });

}