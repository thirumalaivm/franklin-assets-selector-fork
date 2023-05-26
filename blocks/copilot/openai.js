import { initCards, initImage } from "./conversation.js";
import { getCards, getImage } from "./query.js";

async function generate(topic, count, cfg) {
	/* Stubbed values for now */
	/*return [{
		image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
		text: 'AI, or artificial intelligence, refers to the development of computer systems that can perform tasks that typically require human intelligence, such as speech recognition, problem-solving, and decision-making.'
	},
	{
		image: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg',
		text: 'Machine learning, a subset of AI, involves training algorithms to recognize patterns and make predictions based on large amounts of data, enabling systems to improve their performance over time without explicit programming.'
	},
	{
		image: 'https://images.pexels.com/photos/8438951/pexels-photo-8438951.jpeg',
		text: 'Ethical considerations are crucial in AI development, as decisions made by AI systems can have significant social, economic, and ethical implications. Ensuring fairness, transparency, and accountability is essential for responsible AI deployment.'
	}];*/
	try {
		var data = await initCards(cfg);
		console.log('Init cards Response' + JSON.stringify(data, null, 2));
		while (true) {
			console.log('Invoking getCards');
			var cards_response = await getCards(data.conversation_id, topic, count, cfg);
			console.log('Get Cards Response' + JSON.stringify(cards_response, null, 2));
			if (cards_response.dialogue.answer) {
				console.log('Invoking parseCards');
				try {
					const parseCardsResponse = await parseCards(cards_response, cfg);
					console.log('Parse Cards Response' + JSON.stringify(parseCardsResponse, null, 2));
					return parseCardsResponse
				} catch(err) {
					console.log("Unfit getCards response");
				}
			} else {
				console.log("Unfit getCards response");
			}
		}
	}
	catch (err) {
		console.log("RATM!!!");
	}
}

async function parseCards(data, cfg) {
	var cards = [];
	console.log('Parsing Cards');
	for (var i = 0; i < data.dialogue.answer.length; i++) {
		if(data.dialogue.answer[i].title && data.dialogue.answer[i].description) {
			cards.push({
				"title": data.dialogue.answer[i].title,
				"image": "",
				"text": data.dialogue.answer[i].description
			});
		} else {
			throw "Unfit getCards response";
		}
	}
	for (var i = 0; i < cards.length; i++) {
		console.log('Invoking generateImages');
		const generateImagesResponse = await generateImages(cards[i], cfg);
		console.log('Generate Images Response' + JSON.stringify(generateImagesResponse, null, 2));
		cards[i].image = generateImagesResponse;
	}
	return cards;
}

async function generateImages(cards, cfg) {
	for (var i = 0; i < parseInt(cards.length); i++) {
		console.log('Invoking getImage');
		var image = await getImage(/*data.conversation_id*/96593, cards[i].title, cfg);
		console.log('Get Image Response' + JSON.stringify(image, null, 2));
		console.log(image.dialogue.answer);
		if (image.dialogue.answer.indexOf("http")) {
			cards[i].image = image.dialogue.answer.substr(image.dialogue.answer.indexOf("http"));
		} else {
			//retry
			await generateImages({});
		}
	}
}

export { generate };