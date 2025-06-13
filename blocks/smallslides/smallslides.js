export default function decorate(block) {
  block.classList.add('smallslides-initialized');
  const wrapper = document.createElement('div');
  wrapper.className = 'smallslides-track';

  // Helper to create a slide
  function createSlide(imgSrcOrNode, cityName) {
    const slideWrapper = document.createElement('div');
    slideWrapper.style.display = 'flex';
    slideWrapper.style.flexDirection = 'column';
    slideWrapper.style.alignItems = 'center';

    const slide = document.createElement('div');
    slide.className = 'smallslide';

    // Image
    let imgContainer;
    if (typeof imgSrcOrNode === 'string') {
      imgContainer = document.createElement('picture');
      const img = document.createElement('img');
      img.src = imgSrcOrNode;
      img.loading = 'lazy';
      img.alt = cityName || '';
      imgContainer.appendChild(img);
    } else {
      imgContainer = imgSrcOrNode; // already a <picture> or <img>
    }
    slide.appendChild(imgContainer);

    // City name label below the slide
    const label = document.createElement('span');
    label.className = 'smallslide-label';
    label.textContent = cityName || '';

    slideWrapper.appendChild(slide);
    slideWrapper.appendChild(label);

    return slideWrapper;
  }

  // Parse each row (div)
  [...block.children].forEach((row) => {
    let imgSrcOrNode = null;
    let cityName = '';
    // Find image or URL
    const links = row.querySelectorAll('a');
    const pictures = row.querySelectorAll('picture, img');
    if (pictures.length) {
      imgSrcOrNode = pictures[0].cloneNode(true);
    } else if (links.length && links[0].href.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      imgSrcOrNode = links[0].href;
    } else {
      // Try to find a raw URL in text
      const urlMatch = row.textContent.match(/https?:\/\/[^\s]+/);
      if (urlMatch) imgSrcOrNode = urlMatch[0];
    }
    // Find city name (first non-link, non-image text)
    const possibleNames = [...row.querySelectorAll('p, div')].map(el => el.textContent.trim()).filter(Boolean);
    if (possibleNames.length > 1) {
      cityName = possibleNames[1];
    } else if (possibleNames.length === 1) {
      cityName = possibleNames[0];
    }
    // Fallback: try to get the last text node
    if (!cityName) {
      cityName = row.textContent.trim().replace(imgSrcOrNode || '', '').trim();
    }
    // Only add if we have an image
    if (imgSrcOrNode) {
      wrapper.appendChild(createSlide(imgSrcOrNode, cityName));
    }
  });

  block.innerHTML = '';
  block.appendChild(wrapper);

  // Add navigation buttons
  const navPrev = document.createElement('button');
  navPrev.className = 'smallslides-nav prev';
  navPrev.setAttribute('aria-label', 'Previous');
  navPrev.innerHTML = '&#8249;';
  const navNext = document.createElement('button');
  navNext.className = 'smallslides-nav next';
  navNext.setAttribute('aria-label', 'Next');
  navNext.innerHTML = '&#8250;';
  block.appendChild(navPrev);
  block.appendChild(navNext);

  // Scroll logic
  const scrollAmount = 180; // px, matches slide width+gap
  navPrev.addEventListener('click', () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  navNext.addEventListener('click', () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Highlight active slide (centered or first visible)
  function updateActive() {
    const slides = [...wrapper.children];
    let minDist = Infinity;
    let activeIdx = 0;
    const wrapperRect = wrapper.getBoundingClientRect();
    slides.forEach((slide, idx) => {
      const rect = slide.getBoundingClientRect();
      const dist = Math.abs((rect.left + rect.right) / 2 - (wrapperRect.left + wrapperRect.right) / 2);
      if (dist < minDist) {
        minDist = dist;
        activeIdx = idx;
      }
    });
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === activeIdx);
    });
  }
  wrapper.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateActive);
  });
  updateActive();
} 