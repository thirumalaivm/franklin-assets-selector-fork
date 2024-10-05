import { loadScript } from './aem.js';

const codeBasePath = '/aem-assets-blocks';
const blocks = ['video'];
window.hlx = window.hlx || {};
window.hlx.aemassets = {
  codeBasePath,
  blocks,
};
await loadScript(`${codeBasePath}/scripts/aem-assets.js`);
