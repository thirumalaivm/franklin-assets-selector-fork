import { parsePrompt, generateImages, generateTexts } from "./openai";
export default  function decorate(block) {
    block.innerHTML = `
    <h1>Franklin Authoring Copilot</h1>

    <form id="myForm">
      <label for="textInput">Enter Prompt:</label>
      <input type="text" id="textInput" required>

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
        const textInput = document.getElementById('textInput').value;
        const apiKeyInput = document.getElementById('apiKeyInput').value;
        const tokenInput = document.getElementById('tokenInput').value;

        const command = await parsePrompt(apiKeyInput, tokenInput, textInput);
        const images = await generateImages(apiKeyInput, tokenInput, command['item_count']);
        const texts = await generateTexts(apiKeyInput, tokenInput, command['item_count']);
    });

}