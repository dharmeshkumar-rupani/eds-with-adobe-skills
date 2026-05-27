/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-feature
 * Base block: cards
 * Source selector: .inverse.included
 * Project type: xwalk
 * Generated: 2026-05-21
 *
 * Extracts product feature cards from the AVG Ultimate "Included" section.
 * Each card contains: product icon image, product name heading, description, and learn more link.
 * The section heading "Included in AVG Ultimate:" is placed as default content above the block.
 *
 * UE Model (container block):
 *   - Each card item has: image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  // Extract the section heading (placed above block as default content)
  const sectionHeading = element.querySelector('.included-title .h4, .included-title h4, .row.included-title .h4');

  // Extract all card elements
  const cards = Array.from(element.querySelectorAll('.included-card'));

  // Build cells array - container block: each card = one row with [image, text]
  const cells = [];

  cards.forEach((card) => {
    // Extract image (product icon)
    const img = card.querySelector(':scope > img, :scope img');

    // Extract text content: heading + description + link
    const heading = card.querySelector('.included-card-body .h5, .included-card-body h5');
    const description = card.querySelector('.included-card-body .body-3, .included-card-body p');
    // Take only the first visible link (some cards have platform-specific links)
    const link = card.querySelector(':scope > a.link, :scope > a');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      imageCell.appendChild(img);
    }

    // Build text cell with field hint (richtext: heading + description + link)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (heading) {
      const h5 = document.createElement('h5');
      h5.textContent = heading.textContent;
      textCell.appendChild(h5);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent;
      textCell.appendChild(p);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || link.href || '';
      a.textContent = link.textContent.trim();
      textCell.appendChild(a);
    }

    cells.push([imageCell, textCell]);
  });

  // Create the block
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });

  // Place section heading as default content above the block
  if (sectionHeading) {
    const headingEl = document.createElement('h4');
    headingEl.textContent = sectionHeading.textContent;
    element.replaceWith(headingEl, block);
  } else {
    element.replaceWith(block);
  }
}
