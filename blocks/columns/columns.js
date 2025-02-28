export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.classList.add('column');
      
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper) {
          col.classList.add('columns-img-col');
          // Move picture out of text-content
          if (picWrapper.classList.contains('text-content')) {
            col.insertBefore(pic, picWrapper);
            if (!picWrapper.children.length) {
              picWrapper.remove();
            }
          }
        }
      }
      
      // Wrap text content
      const textElements = [...col.children].filter(child => !child.querySelector('picture') && !child.classList.contains('text-content'));
      if (textElements.length) {
        const textWrapper = document.createElement('div');
        textWrapper.classList.add('text-content');
        textElements.forEach(el => textWrapper.appendChild(el));
        col.appendChild(textWrapper);
      }
    });
  });
}
