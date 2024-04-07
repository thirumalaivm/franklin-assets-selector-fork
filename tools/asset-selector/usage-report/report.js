
var cardsContainer = document.getElementById('cardsContainer');

// Fetch JSON data
fetch('/assets-index.json')
    .then(response => response.json())
    .then(data => {
        const rows = data.data;
        const processedUrls = [];
        rows.forEach(row => {
            const { path, 'polaris-assets' : polarisAssets, 'dm-next-assets': dmNextAssets, 'scene7-assets': dmClassicAssets } = row;
            const urls = [...JSON.parse(polarisAssets), ...JSON.parse(dmNextAssets), ...JSON.parse(dmClassicAssets)];

            // Create cards for each URL
            urls.forEach(url => {
                if (!processedUrls.includes(url)) {
                    let type;;
                    if (url.includes('/adobe/assets/urn:aaid:')) {
                        type = 'Polaris';
                    } else if (url.includes('/adobe/dynamicmedia/deliver/urn:aaid:')) {
                        type = 'Dynamic Media - Next';
                    } else if (url.includes('scene7.com/is/image/')) {
                        type = 'Dynamic Media - Classic';
                    }

                    if (type) {
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
                        link.textContent = 'Delivery Url';
                        card.appendChild(link);

                        const p = document.createElement('p');
                        p.textContent = `Type: ${type}` ;
                        card.appendChild(p);
                        cardsContainer.appendChild(card);

                    }
                    processedUrls.push(url);
                }
            });
        });
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
