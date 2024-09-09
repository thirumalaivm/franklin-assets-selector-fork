import {
  loadScript
} from '../../scripts/aem.js'

async function renderCard(card) {
  card.classList.add('card');
  await loadScript('/scripts/test.js');
  Test(card);
}

export default async function decorate(block) {
  await Promise.all([...block.children].map((card) => renderCard(card)));
}