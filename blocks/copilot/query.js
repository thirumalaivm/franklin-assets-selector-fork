	import {callAPI} from "./firefall.js";

	const QUERY_ENDPOINT = '/v2/query';
	const COMPLETIONS_ENDPOINT = "/v1/completions";
	
	var queries = [
		"tell me something about {topic} in {num_words} words or less",
		"tell me something new about {topic} in {num_words} words or less",
		"tell me something different about {topic} in {num_words} words or less",
		"tell me something unique about {topic} in {num_words} words or less"
	]
	
	var counter = 0;

	async function getCard(conversation_id, topic, num_words, cfg) {
		const body = {
			"conversation_id": conversation_id,
			"dialogue":{
				"question": queries[counter%4].replaceAll("{topic}", topic).replaceAll("{num_words}", num_words)
			}
		};
		counter++;
		return await callAPI(QUERY_ENDPOINT, body, cfg);
	}

	async function getImage(conversation_id, title, cfg) {
		const body = {
			"conversation_id": conversation_id,
			"dialogue":{
				"question": "Generate an image for " + title
			}
		};
		return await callAPI(QUERY_ENDPOINT, body, cfg);
	}
	
	async function getText(topic, num_words, cfg) {
		const body = {
			"dialogue": {
				"question": "Tell me something about \"" + topic + "\" in " + num_words + " words or less"
				},
			"llm_metadata": {
				"model_name": "gpt-35-turbo",
				"temperature": 0.7,
				"max_tokens": 2000,
				"top_p": 1.0,
				"frequency_penalty": 0,
				"presence_penalty": 0,
				"n": 1,
				"llm_type": "azure_chat_openai",
				"stop": ["\n", "\t"]
			}
		};
		return await callAPI(COMPLETIONS_ENDPOINT, body, cfg);
	}

	export { getCard, getImage, getText };
