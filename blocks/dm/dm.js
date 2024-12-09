const dprImages = [];
function isDMOpenAPIUrl(src) {
    return /^(https?:\/\/(.*)\/adobe\/assets\/urn:aaid:aem:(.*))/gm.test(src);
}
function adaptPictureTagToDpr(pictureTag, config) {
    // If no picture tag or config is provided, return
    if (!pictureTag || !config) return;

    // Get the base URL and existing parameters from the img tag's src attribute
    const imgTag = pictureTag.querySelector('img');
    const imgSrc = imgTag.getAttribute('src');
    const [baseUrl, params] = imgSrc.split('?');
    const urlParams = new URLSearchParams(params);

    // Remove all existing <source> tags
    while (pictureTag.firstChild && pictureTag.firstChild.nodeName === 'SOURCE') {
        pictureTag.removeChild(pictureTag.firstChild);
    }

    // Add new <source> tags based on configuration
    Object.entries(config).forEach(([key, value]) => {
        const { minWidth, maxWidth, dpr, width } = value;
        const mediaQuery = `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`;

        // Update the dpr and width parameters
        urlParams.set('dpr', dpr);
        urlParams.set('width', width);

        const newSrcSet = `${baseUrl}?${urlParams.toString()}`;

        const newSource = document.createElement('source');
        newSource.setAttribute('media', mediaQuery);
        newSource.setAttribute('srcset', newSrcSet);
        pictureTag.insertBefore(newSource, pictureTag.firstChild);
    });

    // Update the img tag with the default src (for fallback)
    const defaultDpr = window.devicePixelRatio || 1;
    urlParams.set('dpr', defaultDpr);
    imgTag.setAttribute('src', `${baseUrl}?${urlParams.toString()}`);
}

// Example usage:
const pictureTag = document.querySelector('picture');
const config = {
    xlarge: {minWidth: 2048, maxWidth: 9999, dpr: 4, width: 2400},
    large: { minWidth: 1024, maxWidth: 2047, dpr: 3, width: 1800 },
    medium: { minWidth: 768, maxWidth: 1023, dpr: 2, width: 1200 },
    small: { minWidth: 0, maxWidth: 767, dpr: 1, width: 750 }
};

function decorateDprImages() {
    // loop through all the potential smart crop images and
    // update their src & srcset based on viewport width
    dprImages.forEach(async (img) => {
        adaptPictureTagToDpr(img.closest('picture'), config);
    });
}

export default async function decorate(block) {
    const images = block.querySelectorAll('img');
    images.forEach((img) => {
        if (isDMOpenAPIUrl(img.src)) {
            // if the image is a DM OpenAPI URL, add it to the list of smartcrop images
            dprImages.push(img);
        }
    });

    decorateDprImages();
}
