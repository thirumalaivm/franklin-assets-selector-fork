import { generate } from "./openai.js";
import { readBlockConfig } from "../../scripts/lib-franklin.js";
export default function decorate(block) {
  const cfg = readBlockConfig(block);
  block.innerHTML = `
    <h1>Franklin Authoring Copilot</h1>

	<div id="container">
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

  document.getElementById("container").style.display = "block";
  document.getElementById("result").style.display = "none";

  document.getElementById('myForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission
	
	document.getElementById("container").style.display = "none"; 
	document.getElementById("result").style.display = "block";
	document.getElementById("buttons").style.display = "none"; 
	
	const myInterval = setInterval(function() {
		document.getElementById("loading").innerHTML = document.getElementById("loading").innerHTML + "..."; 
	}, 200);
	
	const myInterval2 = setInterval(function() {
		document.getElementById("loading").innerHTML = "AI at work"; 
	}, 2000);
	
	document.getElementById('regenerate').onclick = function() {
		document.getElementById('myForm').submit();
	};
	
    // Get the input values
    const block = document.getElementById('blockSelect').value;
    const topic = document.getElementById('topicInput').value;
    const item_count = document.getElementById('itemsInput').value;
    const content = await generate(topic, item_count, cfg);

	document.getElementById("loading").style.display = "none";
	document.getElementById("gif").style.display = "none";
	document.getElementById("buttons").style.display = "block"; 
	
	clearInterval(myInterval);
	clearInterval(myInterval2);
		
	console.log(content);
    if (content) {
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
	document.getElementById("preview").innerHTML = table;
	const blob = new Blob([table], { type: 'text/html' });
	const data = [new ClipboardItem({ [blob.type]: blob })];
	navigator.clipboard.write(data);
	window.parent.document.getElementById('hlx-sk-palette-copilot').classList.add('hlx-sk-hidden');
    }
    
  });

}