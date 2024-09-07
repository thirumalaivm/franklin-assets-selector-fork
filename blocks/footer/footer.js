import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata("footer");
  block.textContent = "";

  // // load footer fragment
  // const footerPath = footerMeta.footer || '/footer';
  // const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  // const footer = document.createElement('div');
  // while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const footer = document.createElement("div");
  // footer.classList.add("footer");
  // add an id to the footer
  footer.id = "footer";
  footer.append("Copyright © 2024 Adobe. All rights reserved.");

  block.append(footer);
}
