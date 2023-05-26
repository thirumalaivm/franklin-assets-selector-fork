	import {callAPI} from "./firefall.js";

	const CREATE_QUERY_ENDPOINT = '/v2/query';
	
	var queries = [
		"tell me something about {topic} in 50 words or less",
		"tell me something new about {topic} in 50 words or less",
		"tell me something different about {topic} in 50 words or less"
	]
	
	var counter = 0;

	async function getCard(conversation_id, topic, items, cfg) {
		const body = {
			"conversation_id": conversation_id,
			"dialogue":{
				"question": queries[counter%3].replaceAll("{topic}", topic)
				//"I need a JSON cards block on the topic " + topic + " which has " +  items + " items"
			}
		};
		counter++;
		return await callAPI(CREATE_QUERY_ENDPOINT, body, cfg);
	}

	async function getImage(conversation_id, title, cfg) {
		const body = {
			"conversation_id": conversation_id,
			"dialogue":{
				"question": "Generate an image for " + title
			}
		};
		return await callAPI(CREATE_QUERY_ENDPOINT, body, cfg);
	}

	export { getCard, getImage };
