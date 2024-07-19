export default function decorate(block) {
    var configuratorMarkup = '<div id="pdp-carousel" class="product-container">\n' +
          '<main class="container">\n' +
              '<iframe src="http://localhost:3000/viewers?assetName=dior-bag.glb" class="viwr"></iframe>\n' +
          '</main>\n' +
          '<div class="product-details">\n' +
              '<div class="pricing">\n' +
                  '<h1>LuxeCarry Shoulder Bag</h1>\n' +
                  '<br/>\n' +
                  '<p>Elevate your style with the LuxeCarry Leather Shoulder Bag – the epitome of sophistication and functionality. Crafted from premium full-grain leather, this bag exudes timeless elegance while offering ample space for your essentials. Its sleek, minimalist design is perfect for any occasion, whether you're heading to the office, a weekend getaway, or a night out. The adjustable shoulder strap ensures a comfortable fit, while the rich, supple leather ages beautifully, adding character over time. With its secure zip closure and multiple inner compartments, the LuxeCarry Leather Shoulder Bag is your perfect companion for effortless chic. Make a statement and carry luxury with you, wherever you go.</p>\n' +
                  '<br/>\n' +
                  '<h2>Price: $497.50</h2>\n' +
                  '<br/>\n' +
                  '<p>You selected: Red/ bag with green strap</p>\n' +
                  '<button class="buy-button">Add to Cart</button>\n' +
                  '<br/>\n' +
              '</div>\n' +
          '</div>\n' +
      '</div>';
    
    let div= document.createElement('div');
    div.innerHTML = configuratorMarkup;
    block.textContent = '';
    block.append(div);
}
