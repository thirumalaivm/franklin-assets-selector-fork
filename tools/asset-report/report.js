
var cardsContainer = document.getElementById('cardsContainer');

// Fetch JSON data
fetch('/assets-index.json')
    .then(response => response.json())
    .then(data => {
        // Extract the array of URLs
        const urls = JSON.parse(data.data[0]['aem-assets']);

        // Create cards for each URL
        urls.forEach(url => {
            const card = document.createElement('div');
            card.classList.add('card');

            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.frameBorder = '0';
            iframe.width = '100%';
            iframe.height = '400px';

            card.appendChild(iframe);
            const link = document.createElement('a');
            link.href = url;
            link.textContent = url;
            card.appendChild(link);
            cardsContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
