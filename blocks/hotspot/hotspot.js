export default function decorate(block) {
  [...block.children].forEach((row, r) => {
    if (r > 0) {
      const content = [...row.children][0].textContent.trim();
      const isImage = content.endsWith('.jpg') || content.endsWith('.png') || content.endsWith('.gif') || content.endsWith('.jpeg');
      const isVideo = content.endsWith('.mp4') || content.endsWith('.webm') || content.endsWith('play') || content.endsWith('content/'); // Adjust condition as needed
      const isText = !isImage && !isVideo; // Assuming if it's neither image nor video, it's text

      const nexticondiv = document.createElement('div');
      nexticondiv.classList.add('hotspot'); // Added class for CSS targeting
      nexticondiv.style.left = [...row.children][1].textContent;
      nexticondiv.style.top = [...row.children][2].textContent;
      nexticondiv.setAttribute('data', content);

      // Create content display element
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('hotspot-content');

      if (isImage) {
        const img = document.createElement('img');
        img.src = content;
        contentContainer.appendChild(img);
      } else if (isVideo) {
        const video = document.createElement('div');
        video.innerHTML = `<div class="embed-default">
            <iframe src=${content} from allow="encrypted-media" loading="lazy">
            </iframe>
            </div>`;
        // above code can be updated for video controls such as autoplay, loop, etc.
        contentContainer.appendChild(video);
      } else if (isText) {
        contentContainer.textContent = content; // Display text
        contentContainer.classList.add('bgborder');
      }

      // Append content container to hotspot div
      nexticondiv.appendChild(contentContainer);
      nexticondiv.addEventListener('click', () => {
      // Hide content of all other hotspots
        document.querySelectorAll('.hotspot').forEach((hotspot) => {
          if (hotspot !== nexticondiv) {
            hotspot.classList.remove('onclick');
          }
        });
        // Toggle the current hotspot content
        nexticondiv.classList.toggle('onclick');
      });

      row.after(nexticondiv);
      row.remove();
    }
  });
}
