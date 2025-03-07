export default function decorate(block) {
  // Create container for the template
  block.classList.add('dmtemplate-container');
  
  // Get the content from the first element
  const embedContent = block.firstElementChild?.firstElementChild;
  if (!embedContent) return;

  try {
    // Just set the innerHTML directly from the content
    block.innerHTML = embedContent.textContent;
    
  } catch (e) {
    console.error('Error creating DM template embed:', e);
  }
} 