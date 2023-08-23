import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

function replaceImageSrc(pictureElement, newSrc) {
  const imgElement = pictureElement.querySelector('img');

  if (imgElement) {
    // Copy over the query parameters from the existing src
    const existingSrc = imgElement.getAttribute('src');
    const queryStringIndex = existingSrc.indexOf('?');
    const existingQueryParams = queryStringIndex !== -1 ? existingSrc.slice(queryStringIndex + 1) : '';
    const finalSrc = `${newSrc}&${existingQueryParams}`;

    // Update the src attribute of the img element
    imgElement.setAttribute('src', finalSrc);
  }

  // Update the srcset attribute of source elements
  const sourceElements = pictureElement.querySelectorAll('source');
  sourceElements.forEach((sourceElement) => {
    const existingSrcset = sourceElement.getAttribute('srcset');

    // Replace the existing source URL with the new source URL while retaining query parameters
    const newSrcset = existingSrcset.replace(/([^,]+\?[^,]+)(?:,|$)/g, (match, src) => `${newSrc}&${src.substring(src.indexOf('?') + 1)}`);

    // Update the srcset attribute of the source element
    sourceElement.setAttribute('srcset', newSrcset);
  });
}

function decoratePictures(main) {
  const pictureElements = main.querySelectorAll('picture');

  // Iterate over each picture element
  pictureElements.forEach((pictureElement) => {
    const nextSibling = pictureElement.parentNode.nextElementSibling;

    if (nextSibling) {
      if (nextSibling.tagName === 'A' && nextSibling.textContent.trim() === '//External Image//') {
        const newSrc = nextSibling.getAttribute('href');
        replaceImageSrc(pictureElement, newSrc);
        nextSibling.parentNode.removeChild(nextSibling);
      } else if (nextSibling.tagName === 'P') {
        const anchorElement = nextSibling.querySelector('a:first-child');
        if (anchorElement && anchorElement.textContent.trim() === '//External Image//') {
          const newSrc = anchorElement.getAttribute('href');
          replaceImageSrc(pictureElement, newSrc);
          anchorElement.parentNode.removeChild(anchorElement);
        }
      }
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decoratePictures(main);
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
