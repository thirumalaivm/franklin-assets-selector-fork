	import {callAPI} from "./firefall.js";

	const CREATE_CONVERSATION_ENDPOINT = '/v2/conversation';

	async function initCards(cfg) {
		const body = {
			"conversation_name": "build franklin blocks",
			"capability_name": "completions_capability"
		};
		return await callAPI(CREATE_CONVERSATION_ENDPOINT, body, cfg);
	}

	async function initImage(cfg) {
		const body = {
			"conversation_name": "a_test_convo",
			"capability_name": "firefly_image_generation_capability"
		};
		callAPI(CREATE_CONVERSATION_ENDPOINT, body, cfg);
	}

	export { initCards, initImage };
