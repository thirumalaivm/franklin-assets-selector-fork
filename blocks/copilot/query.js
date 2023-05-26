	import {callAPI} from "./firefall.js";

	const CREATE_QUERY_ENDPOINT = '/v2/query';

	async function getCards(conversation_id, topic, items, cfg) {
		const body = {
			"conversation_id": conversation_id,
			"dialogue":{
				"question": "Tell something new about " + topic + " as JSON array of cards with " + items + " items"
				//"I need a JSON cards block on the topic " + topic + " which has " +  items + " items"
			}
		};
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

	export { getCards, getImage };
