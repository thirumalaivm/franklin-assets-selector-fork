export default function decorate(block) {
  // Create container for the template
  block.classList.add('dmtemplate-container');
  
  // Get the content from the first element
  const embedContent = block.firstElementChild?.firstElementChild;
  if (!embedContent) return;

  try {
    // Get the raw HTML string
    const htmlString = embedContent.textContent.trim();
    
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Get the image and map elements from the parsed HTML
    const img = tempDiv.querySelector('img');
    const map = tempDiv.querySelector('map');
    
    if (img) {
      // Create and append the image
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      newImg.width = img.width || '';
      newImg.height = img.height || '';
      newImg.id = img.id || '';
      newImg.setAttribute('usemap', img.getAttribute('usemap') || '');
      block.appendChild(newImg);
    }
    
    if (map) {
      // Create and append the map
      const newMap = document.createElement('map');
      newMap.name = map.name;
      
      // Copy all area elements
      map.querySelectorAll('area').forEach(area => {
        const newArea = document.createElement('area');
        Array.from(area.attributes).forEach(attr => {
          newArea.setAttribute(attr.name, attr.value);
        });
        newMap.appendChild(newArea);
      });
      
      block.appendChild(newMap);
    }
    
    // Remove the original content
    while (block.firstChild !== newImg) {
      block.firstChild.remove();
    }
    
  } catch (e) {
    console.error('Error creating DM template embed:', e);
  }
} 