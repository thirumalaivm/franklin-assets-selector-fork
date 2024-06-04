import { createOptimizedPicture } from '../../scripts/aem.js';
import { decorateVideo } from '../../scripts/video.js';

function isVideo(element) {
  const header = element.querySelector('h2');
  return header && header.textContent.trim().toLowerCase() === 'video';
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else if (isVideo(div)) {
        div.className = 'cards-card-video';
        decorateVideo(div);
      }
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
