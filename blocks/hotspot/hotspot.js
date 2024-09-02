export default function decorate(block) {
    const svgNS = "http://www.w3.org/2000/svg";

    // Create SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    block.appendChild(svg);

    let previousPosition = null;

    [...block.children].forEach((row, r) => {
        if (r > 0) {
            const nexticondiv = document.createElement('div');
            const left = parseFloat([...row.children][1].textContent);
            const top = parseFloat([...row.children][2].textContent);

            nexticondiv.style.left = `${left}%`;
            nexticondiv.style.top = `${top}%`;
            nexticondiv.classList.add('hotspot');
            nexticondiv.setAttribute('data', [...row.children][0].textContent.split(':')[1]);
            nexticondiv.setAttribute('data-city', [...row.children][0].textContent.split('\n')[2].split(':')[0]);
            nexticondiv.addEventListener('click', () => {
                nexticondiv.classList.toggle('onclick');
            });

            row.after(nexticondiv);
            row.remove();

            const currentPosition = { x: left, y: top };

            /*if (previousPosition) {
                // Draw a line between previous and current hotspot
                const line = document.createElementNS(svgNS, "line");
                line.setAttribute("x1", `${previousPosition.x}%`);
                line.setAttribute("y1", `${previousPosition.y}%`);
                line.setAttribute("x2", `${currentPosition.x}%`);
                line.setAttribute("y2", `${currentPosition.y}%`);
                line.setAttribute("stroke", "white");
                line.setAttribute("stroke-width", "2");
                svg.appendChild(line);
            }

            previousPosition = currentPosition;*/
        }
    });
}
