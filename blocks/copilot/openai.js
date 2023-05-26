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
			var cards_response = await getCards(data.conversation_id, topic, count, cfg);

			while(!cards_response.dialogue.answer.cards) {
				cards_response = await getCards(data.conversation_id, topic, count, cfg);
				if(cards_response.dialogue.answer.cards) {
					return await parseCards(cards_response);
				}
			}
		}
		catch(err) {
			console.log("RATM!!!");
		}
	}

	async function parseCards(data) {
		var cards = [];
		console.log(data.dialogue.answer.cards);
		for(var i=0; i < data.dialogue.answer.cards.length; i++) {
			cards.push({
				"title":data.dialogue.answer.cards[i].title,
				"image":"",
				"text":data.dialogue.answer.cards[i].description
			});
			await generateImages(cards, cfg);
		}
		return cards;
	}

	async function generateImages(cards, cfg) {
		for(var i = 0; i < parseInt(cards.length); i ++) {
			var image = await getImage(/*data.conversation_id*/96593, cards[i].title, cfg);
			console.log(image.dialogue.answer);
			if(image.dialogue.answer.indexOf("http")) {
				cards[i].image = image.dialogue.answer.substr(image.dialogue.answer.indexOf("http"));
			} else {
				//retry
				await generateImages({});
			}
		}
	}

export { generate };