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
    const content = await generate(topic, item_count);
	
	console.log('satyam');
	console.log(content);
	const table = `
	<table border="1">
	<tr>
	   <td colspan="2" style="background-color: #ff8012; color: #ffffff;  height:23px;">${block}</td>
	</tr>
	${content.map((item) => {
	  return `
	  <tr>
		<td>${item.text}</td>
		<td>
			  <img loading="lazy" alt="" type="image/jpeg" src=${item.image} width="200" height="300">
		</td>
	  </tr>
	  `;
	}).join('')};
	</table>
	`;
	const blob = new Blob([table], { type: 'text/html' });
	const data = [new ClipboardItem({ [blob.type]: blob })];
	navigator.clipboard.write(data);
	window.parent.document.getElementById('hlx-sk-palette-copilot').classList.add('hlx-sk-hidden');
    
  });

}