import { getAccessToken } from "./ims.js";

const BASE_URL = 'https://firefall-stage.adobe.io';

const maxRetries = 3;
let retries = 0;

async function callAPI(endpoint, body, cfg) {
	const headers = {
		'Content-Type': 'application/json',
		'x-gw-ims-org-id': '1234@AdobeOrg',
		'x-api-key': 'franklin_firefall_service',
		'Authorization': 'Bearer ' + await getAccessToken(cfg)
	};

	const requestOptions = {
		method: 'POST',
		headers: headers
	};

	requestOptions.body = JSON.stringify(body);
	var response;
	await fetch(BASE_URL + endpoint, requestOptions)
		.then(response => response.json())
		.then(data => {
			// Handle the API response data here
			console.log(data);
			response = data;
		})
		.catch(error => {
			// Handle any errors that occurred during the API call
			console.error('Error:', error);

			if (retries < maxRetries) {
				retries++;
				const delay = 5;//Math.pow(2, retries) * 1000; // Exponential delay in milliseconds
				console.log(`Retrying in ${delay}ms...`);
				setTimeout(callAPI, delay, endpoint, body, cfg); // Retry the API call after the delay
			} else {
				console.error('Max retries reached. Unable to call the API ${endpoint}');
			}
		});
	return response;
}

export { callAPI };