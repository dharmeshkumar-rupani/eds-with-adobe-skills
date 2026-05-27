/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product variant.
 * Base block: hero
 * Source: https://www.avg.com/en-us/homepage
 * Selector: #top
 * Generated: 2026-05-21
 *
 * UE Model fields:
 *   - image (reference): Hero background image
 *   - imageAlt (text): Alt text for the image
 *   - text (richtext): Heading, description, CTA buttons, platform links, award info
 */
export default function parse(element, { document }) {
  // --- Extract background image ---
  // Source: direct child img or first img not inside .text/.top-hint areas
  // On live page, image may be a background or nested differently
  const bgImage = element.querySelector(':scope > img')
    || element.querySelector(':scope > picture img, :scope > picture, :scope > .img img, img.hero-bg, img[class*="background"]');

  // --- Extract heading ---
  // Source: h1 inside .span9.text
  const heading = element.querySelector('.span9.text h1, .text h1, h1');

  // --- Extract description ---
  // Source: .body-1.top-text (paragraph with description text)
  const description = element.querySelector('.body-1.top-text, .top-text, .text > p');

  // --- Extract primary CTA button ---
  // Source: .js-pc a.button (PC download link shown by default)
  const ctaButton = element.querySelector('.js-pc a.button, .button-wrapper .js-pc a, a.button.primary');

  // --- Extract platform links ("Also available for...") ---
  // Source: .top-hint .js-pc.body-3 (platform availability text with links)
  const platformLinks = element.querySelector('.top-hint .js-pc.body-3, .top-hint-item-1 .js-pc.body-3');

  // --- Extract award badge ---
  // Source: .top-hint-award (contains award image and text)
  const awardBadge = element.querySelector('.top-hint-award');

  // --- Build cells array matching UE model structure ---
  // UE Model: image (reference), imageAlt (text), text (richtext)
  // Row 1: Background image (single cell)
  // Row 2: All text content in a single cell (richtext)
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([[bgImage]]);
  }

  // Row 2: Text content - all combined into a single cell container
  const textContainer = document.createElement('div');

  if (heading) {
    textContainer.appendChild(heading);
  }

  if (description) {
    textContainer.appendChild(description);
  }

  if (ctaButton) {
    // Wrap CTA in a paragraph for proper block formatting
    const ctaParagraph = document.createElement('p');
    const ctaClone = ctaButton.cloneNode(true);
    // Clean up the link text
    ctaClone.textContent = ctaClone.textContent.trim();
    ctaParagraph.appendChild(ctaClone);
    textContainer.appendChild(ctaParagraph);
  }

  if (platformLinks) {
    // Wrap platform links in a paragraph
    const platformParagraph = document.createElement('p');
    platformParagraph.innerHTML = platformLinks.innerHTML;
    textContainer.appendChild(platformParagraph);
  }

  if (awardBadge) {
    textContainer.appendChild(awardBadge);
  }

  cells.push([[textContainer]]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
