export function renderHero(blockName, content) {
  const html = `
    ${content.map((item) => `
        <img loading="lazy" alt="" type="image/jpeg" src=${item.image} width="200" height="300">
        <h1>${item.text}</h1>
        <hr>
        `).join('')}
    `;
  return html;
}

export function renderTable(blockName, content) {
  const html = `
    <table border="1">
    <tr>
        <td colspan="2" style="background-color: #ff8012; color: #ffffff;  height:23px;">${blockName}</td>
    </tr>
    ${content.map((item) => `
      <tr>
      <td>
        <img loading="lazy" alt="" type="image/jpeg" src=${item.image} width="200" height="300">
      </td>
      <td>${item.text}</td>
      </tr>
      `).join('')}
    </table>
    <hr>
    `;

  return html;
}

const blocksRenderers = {
  hero: renderHero,
  cards: renderTable,
  columns: renderTable,
  carousel: renderTable,
};

export { blocksRenderers };
