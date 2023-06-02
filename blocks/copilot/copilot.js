import { generate } from "./openai.js";
import { initAzureAPI, callAzureAPI } from "./azure.js";
import { readBlockConfig } from "../../scripts/lib-franklin.js";

export default function decorate(block) {
	const blocks_renderer = {
		"hero" : renderHero,
		"cards" : renderCards,
		"column" : renderColumn,
		"carousel" : renderCarousel
	};
	
	function renderHero(){};
	
	function renderColumn(){};
	
	function renderCarousel(){};
	
	function renderCards(block_name, content) {
		const html = `
			<table border="1">
			<tr>
			   <td colspan="2" style="background-color: #ff8012; color: #ffffff;  height:23px;">${block_name}</td>
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
			
		return html;
	};

	const templates = {
		"website" : [
			{"hero" : {count: 1, text_size: 0} },
			{"cards" : {count: 3, text_size: 50} },
			{"column" : {count: 1, text_size: 100} },
			{"carousel" : {count: 1, text_size: 20} }
		],
		"poster" : [
			{"hero" : {count: 1, text_size: 0} },
			{"column" : {count: 1, text_size: 100} }
		],
		"brochure" : [
			{"cards" : {count: 3, text_size: 50} }
		],
		"pamphlet" : [
			{"hero" : {count: 1, text_size: 0} },
			{"cards" : {count: 3, text_size: 50} }
		]
	};

  var clipboardData = "";
  const cfg = readBlockConfig(block);
  block.innerHTML = `
    <h1>Franklin Authoring Copilot</h1>

	<div id="container">
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
	
  document.getElementById("copy").addEventListener("click", async function (event) {
	const data = [new ClipboardItem({ [blob.type]: clipboardData })];
	navigator.clipboard.write(data);
  });
 
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
	
	
    // Get the input value
	const promptStr = document.getElementById('prompt').value;
    //Prepare chat api
	await initAzureAPI(cfg);
	//Call chat api
	const jsonRes = await callAzureAPI(/*"Design a brochure on hiking"*/promptStr, cfg, "user");
	console.log(jsonRes);
	
	var design = templates[jsonRes.template];
		
	for(var i = 0; i < design.length; i++) {
		var block_name = Object.keys(design[i])[0];
		
		console.log("Generating " + jsonRes.template);
		console.log("Topic " + jsonRes.topic);
		console.log("Block " + design[i][block_name]);
		
		const content = await generate(jsonRes.topic, design[i][block_name], cfg);

		document.getElementById("loading").style.display = "none";
		document.getElementById("gif").style.display = "none";
		document.getElementById("buttons").style.display = "block"; 
				
		console.log(content);
		
		if (content) {
			document.getElementById("preview").innerHTML = blocks_renderer[block_name](block_name, content);
			clipboardData = new Blob([table], { type: 'text/html' });
			window.parent.document.getElementById('hlx-sk-palette-copilot').classList.add('hlx-sk-hidden');
		}
	}
	
	clearInterval(myInterval);
	clearInterval(myInterval2);
    
  });
}