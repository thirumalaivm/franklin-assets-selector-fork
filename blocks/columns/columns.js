export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image and video columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }

      const videoUrl = col.querySelector('a[href*="youtube.com"], a[href*="scene7.com"]');
      if (videoUrl) {
        const iframe = document.createElement('iframe');
        iframe.src = videoUrl.href;
        iframe.setAttribute('frameborder', '5');
        iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', true);
        iframe.classList.add('columns-video-col');
        videoUrl.replaceWith(iframe);
      }
    });
  });
}