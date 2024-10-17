export default async function decorate(block) {
  // Select the image within the block
  const anchorElement = block.querySelector('a');

  if (!anchorElement) {
    console.error('Image element not found within the block.');
    return;
  }

  const hrefSrc = anchorElement.getAttribute('href');

  if (!hrefSrc) {
    console.error('Image source (src) attribute is missing.');
    return;
  }

  let deliveryUrl = null;
  let deliveryImageTitle = null;

  try {
    const url = new URL(hrefSrc);

    // Check if the URL contains 'delivery-' in its path
    if (url.toString().includes('delivery-')) {
      // Remove query parameters from the URL
      url.search = '';
      deliveryUrl = url.toString().substring(0, url.toString().lastIndexOf('/play'));
    }
  } catch (error) {
    console.error('Error parsing the image URL:', error);
    return; // Abort further execution if URL parsing fails
  }

  // Fetch metadata if delivery URL is valid
  //append current timestamp as a cache killer in the URL e.g. ${deliveryUrl}/metadata?${Date.now()}
  if (deliveryUrl) {
    try {
      const response = await fetch(`${deliveryUrl}/metadata?${Date.now()}`, {
        headers: {
          'If-None-Match': 'no-cache' // Set 'no-cache' to ensure the latest metadata is fetched
        }
      });

      // Handle HTTP response errors
      if (!response.ok) {
        console.error(`Failed to fetch metadata. HTTP status: ${response.status}`);
        return;
      }

      const metadata = await response.json();

      // Safely access title within assetMetadata
      if (metadata && metadata.assetMetadata && metadata.assetMetadata['dc:title']) {
        deliveryImageTitle = metadata.assetMetadata['dc:title'];
      } else {
        console.warn('No title found in the asset metadata.');
      }
    } catch (error) {
      console.error('Error fetching metadata from the delivery URL:', error);
      return;
    }
  }

  // Apply title as the alt and title attribute for SEO if found
  if (deliveryImageTitle) {
    anchorElement.setAttribute('alt', deliveryImageTitle);
    anchorElement.setAttribute('title', deliveryImageTitle);

    // Insert title below the picture element
    const buttonElement = block.querySelector('div.button-container');
    if (buttonElement) {
      const titleElement = document.createElement('div');
      titleElement.classList.add('title');
      titleElement.innerText = deliveryImageTitle;

      // Insert the title element before the picture element
      buttonElement.before(titleElement);
      buttonElement.remove();
    } else {
      console.error('Picture element not found within the block.');
    }
  } else {
    console.warn('Delivery image title is not available, skipping title insertion.');
  }
}
