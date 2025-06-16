export default function decorate(block) {
  block.classList.add('cardoverlay-initialized');

  // Set background image from section metadata if present
  const section = block.closest('.section');
  if (section && section.dataset.background) {
    section.style.position = 'relative';
    section.style.borderRadius = '1.8rem';
    section.style.background = `url('${section.dataset.background}') center center / cover no-repeat`;
    // Add a dark overlay for readability
    let overlay = section.querySelector('.cardoverlay-bg-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'cardoverlay-bg-overlay';
      overlay.style.borderRadius = '1.8rem';
      overlay.style.position = 'absolute';
      overlay.style.inset = 0;
      overlay.style.background = 'rgba(0,0,0,0.35)';
      overlay.style.zIndex = 0;
      overlay.style.pointerEvents = 'none';
      section.prepend(overlay);
    }
  }

  // Get all items
  const items = [...block.children];

  // The first item is the main heading/text
  const mainTextDiv = items[0]?.querySelector('div') || items[0];
  const mainText = document.createElement('div');
  mainText.className = 'cardoverlay-maintext';
  mainText.innerHTML = mainTextDiv ? mainTextDiv.innerHTML : '';

  // The rest are the cards
  const cardsWrapper = document.createElement('div');
  cardsWrapper.className = 'cardoverlay-cards';

  items.slice(1).forEach((item) => {
    const card = document.createElement('div');
    card.className = 'cardoverlay-card';

    // If the item contains a button or link, make the whole card clickable
    const button = item.querySelector('.button, a.button, a');
    if (button) {
      const href = button.getAttribute('href');
      const title = button.getAttribute('title') || button.textContent.trim();
      const cardLink = document.createElement('a');
      cardLink.href = href;
      cardLink.title = title;
      cardLink.className = 'cardoverlay-card-link';
      cardLink.innerHTML = button.textContent;
      card.appendChild(cardLink);
    } else {
      // Otherwise, use the text and any link
      card.innerHTML = item.innerHTML;
    }

    cardsWrapper.appendChild(card);
  });

  // Clear block and append new structure
  block.innerHTML = '';
  block.appendChild(mainText);
  block.appendChild(cardsWrapper);
} 