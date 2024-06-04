
function loadVideoJs() {
    let resolvePromise;
    const promise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
    })

    const css = document.createElement('link');
    css.setAttribute('href', 'https://vjs.zencdn.net/7.15.4/video-js.css');
    css.setAttribute('rel', 'stylesheet');

    const mainScript = document.createElement('script');
    mainScript.setAttribute('src', 'https://vjs.zencdn.net/7.15.4/video.min.js');
    mainScript.setAttribute('async', 'true');
    mainScript.onload = () => resolvePromise();

    const header = document.querySelector('head');
    header.append(css);
    header.append(mainScript);

    return promise
}

function parseConfig(block) {
    const urlElement = block.querySelector(':scope > p > a');

    const configs = block.querySelectorAll(':scope > ul > li');
    const configObj =  [...configs].reduce((obj, configElement) => {
        if (configElement.childNodes.length === 1) {
            const text = configElement.textContent;
            if (text.includes(':')) {
                const parts = text.split(':');
                if (parts[0].trim().toLowerCase() === 'autoplay') {
                    obj['autoplay'] = parts[1].trim().toLowerCase() === 'on';
                }

                if (parts[0].trim().toLowerCase() === 'autopause') {
                    obj['autopause'] = parts[1].trim().toLowerCase() === 'on';
                }
            }
        }

        return obj;
    }, {});

    configObj.url = urlElement.href;

    return configObj;
}

export function decorateVideo(block){
    const config = parseConfig(block);

    const video = document.createElement('video');
    video.setAttribute('id', 'video-player');
    video.setAttribute('controls', true);
    video.classList.add('video-js', 'vjs-default-skin');

    block.innerHTML = '';
    block.append(video);


    loadVideoJs()
        .then(() => {
            if (document.readyState !== 'complete') {
                return new Promise((resolve, reject) => {
                    document.addEventListener('load', resolve);
                });
            }

            return Promise.resolve();
        }).then(() => {
            const player = videojs('video-player');
            player.src({
                src: config.url,
                type: 'application/x-mpegURL'
            });
            player.muted(config.autoplay);
            player.autoplay(config.autoplay);
        })
}