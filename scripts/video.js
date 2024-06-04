function loadVideoJs() {
  let resolvePromise;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

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

  return promise;
}

function parseButtonConfig(type, configElement) {
  const configs = configElement.querySelectorAll(':scope > li');
  const configObj = [...configs].reduce((obj, cf) => {
    const text = cf.textContent;
    if (text.includes('|')) {
      const parts = text.split('|');
      const key = parts[0].trim().toLowerCase();
      const value = parts[1].trim().toLowerCase();

      if (key === 'position') {
        obj.position = value;
      }

      if (key === 'svg') {
        obj.svg = value;
      }
    }

    return obj;
  }, {});

  return {
    type,
    ...configObj,
  };
}

function parseConfig(block) {
  const urlElement = block.querySelector(':scope > p > a');

  const configs = block.querySelectorAll(':scope > ul > li');

  const configObj = [...configs].reduce((obj, configElement) => {
    const text = configElement.childNodes.length === 1
      ? configElement.textContent
      : configElement.firstChild.textContent;

    if (text.includes('|')) {
      const parts = text.split('|');
      const key = parts[0].trim().toLowerCase();
      const value = parts[1].trim().toLowerCase();

      if (key === 'autoplay') {
        obj.autoplay = value === 'on';
      }

      if (key === 'autopause') {
        obj.autopause = value === 'on';
      }

      if (key === 'button') {
        obj.buttons = obj.buttons || [];
        obj.buttons.push(parseButtonConfig(value, configElement.querySelector(':scope > ul')));
      }
    }

    return obj;
  }, {});

  configObj.url = urlElement.href;

  return configObj;
}

function addCss(styles) {
  const css = document.createElement('style');
  css.type = 'text/css';
  if (css.styleSheet) {
    css.styleSheet.cssText = styles;
  } else {
    css.appendChild(document.createTextNode(styles));
  }

  document.getElementsByTagName('head')[0].appendChild(css);
}

function setupCustomPlayButton(block, player, config) {
  const button = document.createElement('button');
  button.classList.add('custom-play-button');
  button.addEventListener('click', () => {
    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
  });

  const img = document.createElement('img');
  img.setAttribute('src', config.svg);

  button.append(img);

  const container = block.querySelector('.video-container');
  container.append(button);

  let top;
  let bottom;
  let left;
  let right;
  if (config.position === 'top-right') {
    top = '10px';
    right = '10px';
  } else if (config.position === 'top-left') {
    top = '10px';
    left = '10px';
  } else if (config.position === 'bottom-left') {
    bottom = '10px';
    left = '10px';
  } else {
    bottom = '10px';
    right = '10px';
  }

  // eslint-disable-next-line prefer-template
  const styles = `
    .custom-play-button {
      position: absolute;
      ${(top ? 'top: ' + top + ';' : '')}
      ${(bottom ? 'bottom: ' + bottom + ';' : '')}
      ${(left ? 'left: ' + left + ';' : '')}
      ${(right ? 'right: ' + right + ';' : '')}
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #fff;
      color: #000;
      padding: 5px;
      margin: 0;
    }
  `;

  addCss(styles);
}

function setupCustomMuteButton(block, player, config) {
  const button = document.createElement('button');
  button.classList.add('custom-mute-button');
  button.addEventListener('click', () => {
    if (player.muted()) {
      player.muted(false);
    } else {
      player.muted(true);
    }
  });

  const img = document.createElement('img');
  img.setAttribute('src', config.svg);

  button.append(img);

  const container = block.querySelector('.video-container');
  container.append(button);

  let top;
  let bottom;
  let left;
  let right;
  if (config.position === 'top-right') {
    top = '10px';
    right = '10px';
  } else if (config.position === 'top-left') {
    top = '10px';
    left = '10px';
  } else if (config.position === 'bottom-left') {
    bottom = '10px';
    left = '10px';
  } else {
    bottom = '10px';
    right = '10px';
  }

  const styles = `
    .custom-mute-button {
      position: absolute;
      ${(top ? 'top: ' + top + ';' : '')}
      ${(bottom ? 'bottom: ' + bottom + ';' : '')}
      ${(left ? 'left: ' + left + ';' : '')}
      ${(right ? 'right: ' + right + ';' : '')}
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #fff;
      color: #000;
      padding: 5px;
      margin: 0;
    }

    .custom-play-button + .custom-mute-button {
      ${(top ? 'top: 80px;' : '')}
      ${(bottom ? 'bottom: 80px;' : '')}
    }
  `;

  addCss(styles);
}

function setupAutopause(video, player) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        player.play();
      } else {
        player.pause();
      }
    });
  }, {
    threshold: [0.5, 0],
  });

  observer.observe(video);
}

function setupPlayer(block, config) {
  const videoElement = block.querySelector('video.video-js');
  // eslint-disable-next-line no-undef
  const player = videojs(videoElement, {
    bigPlayButton: false,
  });
  player.src({
    src: config.url,
    type: 'application/x-mpegURL',
  });

  player.muted(config.autoplay || config.muted);
  player.autoplay(config.autoplay);

  if (config.autopause) {
    setupAutopause(videoElement, player);
  }

  if (config.buttons && config.buttons.length > 0) {
    config.buttons.forEach((button) => {
      if (button.type === 'play') {
        setupCustomPlayButton(block, player, button);
      }

      if (button.type === 'mute') {
        setupCustomMuteButton(block, player, button);
      }
    });
  }
}

export function isVideo(element) {
  const header = element.querySelector('h2');
  return header && header.textContent.trim().toLowerCase() === 'video';
}

export function decorateVideo(block) {
  const config = parseConfig(block);
  const video = document.createElement('video');
  video.setAttribute('controls', config.controls);
  video.classList.add('video-js', 'vjs-default-skin');

  const container = document.createElement('div');
  container.classList.add('video-container');
  container.style.position = 'relative';
  container.append(video);

  block.innerHTML = '';
  block.append(container);

  loadVideoJs()
    .then(() => {
      if (document.readyState !== 'complete') {
        return new Promise((resolve) => {
          document.addEventListener('load', resolve);
        });
      }

      return Promise.resolve();
    }).then(() => {
      setupPlayer(block, config);
    });
}
