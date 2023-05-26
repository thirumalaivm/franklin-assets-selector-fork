import { initCards, initImage } from "./conversation.js";
import { getCard, getImage } from "./query.js";

var topic_var;

async function generate(topic, count, cfg) {
	try {
		topic_var = topic;
		var cards = [];
		var data = await initCards(cfg);
		console.log('Init cards Response' + JSON.stringify(data, null, 2));
		for (var i = 0; i < count; i++) {
			var done = false;
			while (!done) {
				console.log('Invoking getCard');
				var card_response = await getCard(data.conversation_id, topic, count, cfg);
				console.log('Get Card Response' + JSON.stringify(card_response, null, 2));
				if (card_response.dialogue.answer) {
					console.log('Invoking parseCard');
					try {
						const parseCardResponse = await parseCard(card_response, cfg);
						console.log('Parse Card Response' + JSON.stringify(parseCardResponse, null, 2));
						cards.push({
							"text":parseCardResponse
						});
						done = true;
					} catch(err) {
						console.log("Unfit getCard response");
					}
				} else {
					console.log("Unfit getCard response");
				}
			}
		}
		
		for (var i = 0; i < cards.length; i++) {
			var done = false;
			while (!done) {
				try {
					console.log('Invoking generateImage');
					const generateImageResponse = await generateImage(cards[i], cfg);
					console.log('Generate Image Response' + JSON.stringify(generateImageResponse, null, 2));
					cards[i].image = generateImageResponse;
					done = true;
				} catch(err) {
					console.log("Unfit generateImageResponse response");
				}
			}
		}
		
		return cards;
	}
	catch (err) {
		console.log("RATM!!!");
	}
}

async function parseCard(data, cfg) {
	var card = [];
	console.log('Parsing Card');
	if(data.dialogue.answer) {
		return data.dialogue.answer;
	} else {
		throw "Unfit getCard response";
	}
	
	return card;
}

async function generateImage(card, cfg) {
	console.log('Invoking getImage');
	var image = await getImage(/*data.conversation_id*/96593, topic_var, cfg);
	console.log('Get Image Response' + JSON.stringify(image, null, 2));
	console.log(image.dialogue.answer);
	if (image.dialogue.answer.indexOf("http")) {
		return image.dialogue.answer.substr(image.dialogue.answer.indexOf("http"));
	} else {
		//retry
		throw "Unfit generateImage response";
	}
}

export { generate };