const codeBasePath = '/aem-assets-blocks';
const blocks = ['video'];

export default async function assetsInit() {
  const { loadBlock, createOptimizedPicture } = await import(`${codeBasePath}/scripts/aem-assets.js`);
  window.hlx = window.hlx || {};
  window.hlx.aemassets = {
    codeBasePath,
    blocks,
    loadBlock,
    createOptimizedPicture,
  };
}
