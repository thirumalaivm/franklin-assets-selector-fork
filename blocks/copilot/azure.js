var messages = [];

const AZURE_CHAT_API = 'https://eastus.api.cognitive.microsoft.com/openai/deployments/satyam-oai-deployment/chat/completions?api-version=2023-03-15-preview&api-key=${apiKey}';

const maxRetries = 3;
let retries = 0;

async function initAzureAPI(cfg) {
	messages = [];
	return await callAzureAPI("parse this sentence as json 'Create a travel website of Forts in Jaipur' as follows {\"topic\": \"Forts in Jaipur\", \"template\": \"website\", \"action\": \"create\"} Now parse this sentence similarly 'Create a travel website on hiking'", cfg, "system");	
}

async function callAzureAPI(msg, cfg, role) {
	var key = "64087d1089dc4308b9a3fd079ac0fab2";

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	};
	
	if(role === "system") {
		messages.push({
			"role": role,
			"content": msg
		});
	}
	else if(role === "user") {
		messages.push({
			"role": role,
			"content": "Do the same for '" + msg + "'"
		});
	}

	requestOptions.body = JSON.stringify({"messages":messages});
	console.log(AZURE_CHAT_API.replaceAll("${apiKey}", key/*cfg.apiKey*/));
	console.log(requestOptions);
	
	var response;
	await fetch(AZURE_CHAT_API.replaceAll("${apiKey}", key/*cfg.apiKey*/), requestOptions)
		.then(response => {

		  // Check that the response is valid and reject an error
		  // response to prevent subsequent attempt to parse json
		  if(!response.ok) {
			 return Promise.reject('Response not ok with status ' + response.status);
		  }

		  return response;
		})
		.then(response => response.json())
		.then(data => {
			// Handle the API response data here
			console.log(data);
			response = data.choices[0].message;
		})
		.catch(error => {
			// Handle any errors that occurred during the API call
			console.error('Error:', error);

			if (retries < maxRetries) {
				retries++;
				const delay = 5;//Math.pow(2, retries) * 1000; // Exponential delay in milliseconds
				console.log(`Retrying in ${delay}ms...`);
				setTimeout(callAzureAPI, delay, msg, cfg); // Retry the API call after the delay
			} else {
				console.error('Max retries reached. Unable to call the API ${endpoint}');
			}
		});
		
	messages.push(response);
	
	return JSON.parse(response.content);
}


export { callAzureAPI, initAzureAPI };