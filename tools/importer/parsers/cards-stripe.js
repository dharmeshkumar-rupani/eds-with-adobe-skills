/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-stripe
 * Base block: cards
 * Source: https://www.avg.com/en-us/homepage
 * Selector: .section-usp-stripe
 * Description: Horizontal row of 4 USP items, each with an icon image and short text.
 * UE Model fields per card: image (reference), text (richtext)
 * Generated: 2026-05-21
 */
export default function parse(element, { document }) {
  // Each .usp-stripe-item contains an img + span
  const items = element.querySelectorAll('.usp-stripe-item');

  const cells = [];

  items.forEach((item) => {
    // Extract image - the icon for this USP item
    const img = item.querySelector('img');

    // Extract text - the short description span
    const span = item.querySelector('span');

    // Build image cell with field hint for xwalk
    const imageCell = [];
    if (img) {
      const picture = document.createElement('picture');
      const picImg = document.createElement('img');
      picImg.src = img.src;
      picImg.alt = img.alt || '';
      picture.appendChild(picImg);
      imageCell.push(picture);
    }

    // Build text cell with field hint for xwalk
    const textCell = [];
    if (span) {
      const p = document.createElement('p');
      p.textContent = span.textContent.trim();
      textCell.push(p);
    }

    // Each card is a row with two cells: [image, text]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stripe', cells });
  element.replaceWith(block);
}
