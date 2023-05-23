export async function parsePrompt(apiKey, token, prompt) {
    /* Stubbed values for now */
    return {
        block: 'cards',
        topic: 'Artificial Intelligence and Machine Learning',
        item_count: 3,
    }
}

export async function generateImages(apiKey, token, topic, count) {
    /* Stubbed values for now */
    return ['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
        'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg',
        'https://images.pexels.com/photos/8438951/pexels-photo-8438951.jpeg'];
}

export async function generateTexts(apiKey, token, topic, count) {
    /* Stubbed values for now */
    return ['AI, or artificial intelligence, refers to the development of computer systems that can perform tasks that typically require human intelligence, such as speech recognition, problem-solving, and decision-making.',
        'Machine learning, a subset of AI, involves training algorithms to recognize patterns and make predictions based on large amounts of data, enabling systems to improve their performance over time without explicit programming.',
        'Ethical considerations are crucial in AI development, as decisions made by AI systems can have significant social, economic, and ethical implications. Ensuring fairness, transparency, and accountability is essential for responsible AI deployment.'];
}