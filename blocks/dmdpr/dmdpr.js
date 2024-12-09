const dprImages = [];

function isDMOpenAPIUrl(src) {
    return /^(https?:\/\/(.*)\/adobe\/assets\/urn:aaid:aem:(.*))/gm.test(src);
}

function updateDprInUrl(url, dpr) {
    const [baseUrl, params] = url.split('?');
    const urlParams = new URLSearchParams(params);
    urlParams.set('dpr', dpr);
    return `${baseUrl}?${urlParams.toString()}`;
}

function updateDprImages() {
    const dpr = window.devicePixelRatio || 1;
    dprImages.forEach((img) => {
        const src = img.getAttribute('src');
        img.setAttribute('src', updateDprInUrl(src, dpr));

        const sources = img.closest('picture').querySelectorAll('source');
        sources.forEach((source) => {
            const srcset = source.getAttribute('srcset');
            source.setAttribute('srcset', updateDprInUrl(srcset, dpr));
        });
    });
}

export default async function decorate(block) {
    const images = block.querySelectorAll('img');
    images.forEach((img) => {
        if (isDMOpenAPIUrl(img.src)) {
            dprImages.push(img);
        }
    });

    updateDprImages();
    window.addEventListener('resize', updateDprImages);
}
