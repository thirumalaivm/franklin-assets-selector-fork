let slideIndex = 0;

function template(items) {
  const tl = `
    ${items.map((item) => {
    const tl = `<div class="carousel-slide">
        ${item.picture.outerHTML}
        ${item.content.outerHTML}
      </div>`;
    return tl;
  }).join('')}
    <a class="carousel-prev" href="#">&#10094;</a>
    <a class="carousel-next" href="#">&#10095;</a>
  `;
  return tl;
}

function changeSlide(n, block) {
  showSlide((slideIndex += n), block);
}

function showSlide(n, block) {
  let slides = block.querySelectorAll(".carousel-slide");
  if (n == slides.length) {
    slideIndex = 0;
  }
  if (n < 0) {
    slideIndex = slides.length - 1;
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  console.log(slideIndex);
  slides[slideIndex].style.display = "block";
}


function parse(block) {
  const items = [];
  block.querySelectorAll(":scope > div").forEach((item) => {
    items.push({
      picture: item.querySelector("div:first-of-type > picture"),
      content: item.querySelector("div:last-of-type"),
    });
  });
  return items;
}

export default function decorate(block) {
  block.innerHTML = template(parse(block));
  showSlide(slideIndex, block);
  block.querySelector(".carousel-prev").addEventListener("click", () => {
    changeSlide(-1, block);
  });
  block.querySelector(".carousel-next").addEventListener("click", () => {
    changeSlide(1, block);
  });
  // Change slide every 5 seconds
  setInterval(function () {
    changeSlide(1, block);
  }, 4000);
}
