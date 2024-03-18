import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
    var colorMarkup = '<label for="colorPicker">Choose a color:</label>\n' +
        '<input type="color" id="colorPicker" name="colorPicker" value="#ff0000">'
    let div= document.createElement('div');
    div.innerHTML = colorMarkup;
    block.textContent = '';
    block.append(div);
}
