import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {

  // // // Create a picture element with optimized images
  // const picture = createOptimizedPicture({
  //   src: 'https://slimages.macysassets.com/is/image/MCY/products/9/optimized/29516499_fpx.tif?qlt=80,0&resMode=sharp2&op_usm=1.75,0.3,2,0&fmt=webp&wid=800',
  //   alt: 'Bill Murray',
  //   sizes: '(min-width: 800px) 800px, 100vw',
  //   breakpoints: [400, 800, 1200],
  //   formats: ['webp', 'jpeg'],
  // });

  const image = document.createElement('img');
  image.src = block.textContent.trim();
  image.alt = 'test';
  image.className = 'dynamic-image';

  block.textContent = '';

  // Append image element to the block
  block.appendChild(image);

}
