export default function decorate(block) {
    var carouselMarkup = 
    '<div id="pdp-carousel" class="product-container">\n' +
        '<main class="container">\n' +
            '<div class="slider-container" id="new-products">\n'+
                '<div class="main-product-container">\n'+
                    '<img id="display-image" src="https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=is(genaibeta/LeatherSofa?wid=3000)&layer=1&src=is(genaibeta/LeatherSofa?wid=3000)&mask=is(genaibeta/Mask3?wid=3000)&cache=off" alt="Main" class="main-product"/>\n'+
                '</div>\n'+
                '<div class="slides-wrapper">\n'+
                    '<div class="slides-container">\n'+
                        '<ul class="slider-list">\n'+
                            '<li id="image1" class="slider-item">\n'+
                                '<a href="#">\n'+
                                '<img src="https://s7g10.scene7.com/is/image/genaibeta/LeatherSofa?wid=200&hei=170" alt="New Product 1" />\n'+
                                '</a>\n'+
                            '</li>\n'+
                            '<li id="image2" class="slider-item">\n'+
                                '<a href="#">\n'+
                                '<img src="https://s7ap1.scene7.com/is/image/varun/SofaRight?wid=200&hei=170" alt="New Product 2" />\n'+
                                '</a>\n'+
                            '</li>\n'+
                            '<li id="image3" class="slider-item">\n'+
                                '<a href="#">\n'+
                                '<img src="https://s7ap1.scene7.com/is/image/varun/SofaLeft?wid=200&hei=170" alt="New Product 3" />\n'+
                                '</a>\n'+
                            '</li>\n'+
                            '<li id="image4" class="slider-item">\n'+
                                '<a href="#">\n'+
                                '<img src="https://s7ap1.scene7.com/is/image/varun/SofaBack?wid=200&hei=170" alt="New Product 4" />\n'+
                                '</a>\n'+
                            '</li>\n'+
                            '<li id="video-card" class="slider-item">\n'+
                                '<a href="#">\n'+
                                '<img src="https://s7ap1.scene7.com/is/image/varun/LeatherSofaVidThumb?wid=200&hei=170" alt="New Product 5" />\n'+
                                '</a>\n'+
                            '</li>\n'+
                        '</ul>\n'+
                    '</div>\n'+
                '</div>\n'+
                '<div class="slider-arrows">\n'+
                    '<button type="button" class="slider-arrow-prev">Prev</button>\n'+
                    '<button type="button" class="slider-arrow-next">Next</button>\n'+
                '</div>\n'+
            '</div>\n'+
        '</main>\n' +
        '<div class="product-details">\n'+
            '<div class="pricing">\n'+
                '<h2>Regal Sofa</h2>\n'+
                '<p>Price: $497.50</p>\n'+
                '<button>Add to Cart</button>\n'+
                '<br/>\n'+
                '<label for="colorPicker">Pick Sofa Color: &nbsp;</label><br/>\n'+
                '<input type="color" id="colorPicker" name="colorPicker" value="#E3DEDA">\n'+

                '<p>Pick Wall Color:</p>\n'+
                '<div class="card-container">\n'+
                '<div class="card">\n'+
                    '<img id="red-wall" src="https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=ai(genaibeta/LeatherSofa?genReplace=bg,red%20wall%20with%20sunlight%20and%20shadows&op_gen=get)" alt="Image 1">\n' +
                '</div>\n'+
                '<div class="card">\n'+
                    '<img id="yellow-wall" src="https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=ai(genaibeta/LeatherSofa?genReplace=bg,yellow%20wall%20with%20shadows%20and%20sunlight&op_gen=get)" alt="Image 2">\n' +
                '</div>\n'+
                '<div class="card">\n'+
                    '<img id="blue-wall" src="https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=ai(genaibeta/LeatherSofa?genReplace=bg,blue%20wall%20with%20sunlight%20and%20shadows&op_gen=get)" alt="Image 3">\n' +
                '</div>\n'+
                '<div class="card">\n'+
                    '<img id="grey-wall" src="https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=ai(genaibeta/LeatherSofa?genReplace=bg,grey%20wall%20with%20shadows%20and%20sunlight&op_gen=get)" alt="Image 4">\n' +
                '</div>\n'+
            '</div>\n'+
        '</div>\n'+
    '</div>'

    let div= document.createElement('div');
    div.innerHTML = carouselMarkup;
    block.textContent = '';
    block.append(div);
}

waitForElement("#pdp-carousel").then(() => {
    var redWall = document.getElementById("red-wall");
    redWall.addEventListener('click', () => {
        var picture = document.getElementById("display-image");
        var imgUrl = "https://s7g1.scene7.com/is/image/genaibeta?layer=0&src=is(genaibeta/LeatherSofa?wid=3000)&layer=1&src=ai(genaibeta/LeatherSofa?genReplace=bg,red%20wall%20with%20sunlight%20and%20shadows&op_gen=get)&mask=is(genaibeta/Mask3Inverse?wid=3000)&layer=2&src=is(genaibeta/LeatherSofa?wid=3000)&mask=is(genaibeta/Mask3?wid=3000)";
        picture.src = imgUrl;
    });
    var yellowWall = document.getElementById("yellow-wall");
    yellowWall.addEventListener('click', () => {
        var picture = document.getElementById("display-image");
        var imgUrl = "https://s7g1.scene7.com/is/image/genaibeta?layer=0&src=is(genaibeta/LeatherSofa?wid=3000)&layer=1&src=ai(genaibeta/LeatherSofa?genReplace=bg,yellow%20wall%20with%20shadows%20and%20sunlight&op_gen=get)&mask=is(genaibeta/Mask3Inverse?wid=3000)&layer=2&src=is(genaibeta/LeatherSofa?wid=3000)&mask=is(genaibeta/Mask3?wid=3000)";
        picture.src = imgUrl;
    });
    var blueWall = document.getElementById("blue-wall");
    blueWall.addEventListener('click', () => {
        var picture = document.getElementById("display-image");
        var imgUrl = "https://s7g1.scene7.com/is/image/genaibeta?layer=0&src=is(genaibeta/LeatherSofa?wid=3000)&layer=1&src=ai(genaibeta/LeatherSofa?genReplace=bg,blue%20wall%20with%20sunlight%20and%20shadows&op_gen=get)&mask=is(genaibeta/Mask3Inverse?wid=3000)&layer=2&src=is(genaibeta/LeatherSofa?wid=3000)&mask=is(genaibeta/Mask3?wid=3000)";
        picture.src = imgUrl;
    });
    var greyWall = document.getElementById("grey-wall");
    greyWall.addEventListener('click', () => {
        var picture = document.getElementById("display-image");
        var imgUrl = "https://s7g1.scene7.com/is/image/genaibeta?layer=0&src=is(genaibeta/LeatherSofa?wid=3000)&layer=1&src=ai(genaibeta/LeatherSofa?genReplace=bg,grey%20wall%20with%20shadows%20and%20sunlight&op_gen=get)&mask=is(genaibeta/Mask3Inverse?wid=3000)&layer=2&src=is(genaibeta/LeatherSofa?wid=3000)&mask=is(genaibeta/Mask3?wid=3000)";
        picture.src = imgUrl;
    });

    document.getElementById("colorPicker").addEventListener("input", function() {
        var color = this.value;

        var picture = document.getElementById("display-image");
        var originalUrl = picture.src;

        var newUrl = originalUrl.includes("op_colorize") ? originalUrl.replace(/(op_colorize=)[a-fA-F0-9]+/, "$1" + color.substring(1)) : originalUrl+"&op_colorize="+color.substring(1);
        picture.src = newUrl;
    });

    document.getElementById("video-card").addEventListener("click", function() {
        const picture = document.getElementById("display-image");
        if(picture){
          const container = picture.parentElement;
  
          const videoChild = document.createElement('div');
          videoChild.id="s7smartcropvideo_div";
          videoChild.class="smart-crop-video main-product";
  
          container.removeChild(picture);
          container.appendChild(videoChild);
          loadScript('https://s7g10.scene7.com/s7viewers/html5/js/SmartCropVideoViewer.js', function() {
              var s7smartcropvideoviewer = new s7viewers.SmartCropVideoViewer({
                  "containerId" : "s7smartcropvideo_div",
                  "params" : { 
                    "serverurl" : "https://s7g10.scene7.com/is/image/",
                    "contenturl" : "https://s7g10.scene7.com/is/content/", 
                    "config" : "genaibeta/SmartCropVideo",
                    "videoserverurl": "https://s7g10.scene7.com/is/content",
                    "asset" : "genaibeta/Original%20Video-AVS",
                  }
              })
              s7smartcropvideoviewer.init(); 
          });
        }
    })

    document.getElementById("image1").addEventListener("click", function() {
      const picture = document.getElementById("display-image");
      if(picture){
        picture.src="https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=is(genaibeta/LeatherSofa?wid=3000)&layer=1&src=is(genaibeta/LeatherSofa?wid=3000)&mask=is(genaibeta/Mask3?wid=3000)&cache=off";
      } else {
        const videoChild = document.getElementById('s7smartcropvideo_div');
        const parent = videoChild.parentElement;
        const imageChild = document.createElement('img');
        imageChild.src = "https://s7g10.scene7.com/is/image/genaibeta?layer=0&src=is(genaibeta/LeatherSofa?wid=3000)&layer=1&src=is(genaibeta/LeatherSofa?wid=3000)&mask=is(genaibeta/Mask3?wid=3000)&cache=off";
        imageChild.id = "display-image";
        parent.removeChild(videoChild);
        parent.appendChild(imageChild);
      }
    })
    document.getElementById("image2").addEventListener("click", function() {
      const picture = document.getElementById("display-image");
      if(picture){
        picture.src="https://s7ap1.scene7.com/is/image/varun/SofaRight?wid=1200";
      } else {
        const videoChild = document.getElementById('s7smartcropvideo_div');
        const parent = videoChild.parentElement;
        const imageChild = document.createElement('img');
        imageChild.src = "https://s7ap1.scene7.com/is/image/varun/SofaRight?wid=1200";
        imageChild.id = "display-image";
        parent.removeChild(videoChild);
        parent.appendChild(imageChild);
      }
    })
    document.getElementById("image3").addEventListener("click", function() {
      const picture = document.getElementById("display-image");
      if(picture){
        picture.src="https://s7ap1.scene7.com/is/image/varun/SofaLeft?wid=1200";
      } else {
        const videoChild = document.getElementById('s7smartcropvideo_div');
        const parent = videoChild.parentElement;
        const imageChild = document.createElement('img');
        imageChild.src = "https://s7ap1.scene7.com/is/image/varun/SofaLeft?wid=1200";
        imageChild.id = "display-image";
        parent.removeChild(videoChild);
        parent.appendChild(imageChild);
      }
    })
    document.getElementById("image4").addEventListener("click", function() {
      const picture = document.getElementById("display-image");
      if(picture){
        picture.src="https://s7ap1.scene7.com/is/image/varun/SofaBack?wid=1200";
      } else {
        const videoChild = document.getElementById('s7smartcropvideo_div');
        const parent = videoChild.parentElement;
        const imageChild = document.createElement('img');
        imageChild.src = "https://s7ap1.scene7.com/is/image/varun/SofaBack?wid=1200";
        imageChild.id = "display-image";
        parent.removeChild(videoChild);
        parent.appendChild(imageChild);
      }
    })
    

    class Slider {
        constructor(id, mediaQueries) {
          // Get HTML elements
          this.slider = document.querySelector(`#${id}`);
          this.sliderList = this.slider.querySelector('.slider-list');
          this.sliderItems = this.slider.querySelectorAll('.slider-item');
          this.sliderNext = this.slider.querySelector('.slider-arrow-next');
          this.sliderPrev = this.slider.querySelector('.slider-arrow-prev');
  
          // Get media queries
          this.mediaQueryList = [window.matchMedia(`screen and (max-width:${mediaQueries[0] - 1}px)`)];
          mediaQueries.forEach((mediaQuery) => {
            this.mediaQueryList.push(window.matchMedia(`screen and (min-width:${mediaQuery}px)`));
          });
  
          // Define global variables
          this.numberOfVisibleItems = null;
          this.currentItemIndex = null;
          this.sliderItemsLength = this.sliderItems.length;
          this.mediaQueryLength = this.mediaQueryList.length;
  
          // Add event listener: to call the run function again when screen resized
          this.mediaQueryList.forEach((mediaQuery) => {
            mediaQuery.addEventListener('change', () => {
              this.run();
            });
          });
  
          // Add event listener: to go to next slide
          this.sliderNext.addEventListener('click', () => {
            if (this.currentItemIndex < this.sliderItemsLength - this.numberOfVisibleItems) {
              this.currentItemIndex++;
              this.shiftSlides();
            }
          });
  
          // Add event listener: to go to previous slide
          this.sliderPrev.addEventListener('click', () => {
            if (this.currentItemIndex > 0) {
              this.currentItemIndex--;
              this.shiftSlides();
            }
          });
  
          // Disable focus on all slides links
          this.sliderItems.forEach((item) => {
            const elements = item.querySelectorAll('a');
            elements.forEach((element) => {
              element.tabIndex = '-1';
            });
          });
  
          // Add event listener: to scroll down to slider when previous arrow focused
          this.sliderPrev.addEventListener('focusin', () => {
            this.slider.scrollIntoView();
          });
  
          // Add event listener: to scroll down to slider when next arrow focused
          this.sliderNext.addEventListener('focusin', () => {
            this.slider.scrollIntoView();
          });
        }
  
        // Run the slider
        run() {
          let index = this.mediaQueryLength - 1;
          while (index >= 0) {
            if (this.mediaQueryList[index].matches) {
              // Set number of visible slides
              this.numberOfVisibleItems = index + 1;
  
              // Reset the slider
              this.currentItemIndex = 0;
              this.sliderList.style.transform = 'translateX(0%)';
  
              // Set slider list width
              this.sliderList.style.width = `calc(${(100 / (this.numberOfVisibleItems + 1)) * this.sliderItemsLength}% - 240px)`;
  
              // Set slides width
              this.sliderItems.forEach((item) => {
                item.style.width = `${100 / (this.numberOfVisibleItems+1)}%`;
              });
  
              // Exit the loop
              break;
            }
            index--;
          }
        }
  
        // A function to shift slides left and right
        shiftSlides() {
          this.sliderList.style.transform = `translateX(-${(100 / this.sliderItemsLength) * this.currentItemIndex}%)`;
        }
      }
  
      // Create a new slider and run it for new-products
      const newProductsSlider = new Slider('new-products', [576, 992]);
      newProductsSlider.run();
  
      // Create a new slider and run it for featured-products
      const featuredProductsSlider = new Slider('featured-products', [576, 768, 992]);
      featuredProductsSlider.run();
});

function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
  
    // Execute the callback function once the script is loaded
    script.onload = callback;
  
    // Append the script to the document's head
    document.head.appendChild(script);
}

function waitForElement(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // Observe changes in the entire document body (including subtree)
        observer.observe(document.body, { childList: true, subtree: true });
    });
}
