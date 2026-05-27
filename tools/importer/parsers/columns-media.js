/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-media variant.
 * Base block: columns
 * Source: https://www.avg.com/en-us/homepage
 * Selectors: #media-1, #media-2, #media-3
 * Generated: 2026-05-21T00:00:00Z
 *
 * Two-column layout with:
 * - One column: product device screenshot image
 * - Other column: product icon + product name, heading (h2), description, CTA buttons
 *
 * Handles variations:
 * - Image left / text right (#media-1, #media-3)
 * - Text left / image right (#media-2)
 * - Platform-specific content (js-pc, js-mac, js-android, js-ios) - extracts PC as default
 *
 * xwalk project: Columns blocks do NOT require field hints per hinting rules.
 */
export default function parse(element, { document }) {
  // Identify image column and text column
  const imageCol = element.querySelector('.span6.img, .img, [class*="img"]');
  const textCol = element.querySelector('.span6.text, .text, [class*="text"]:not([class*="body"])');

  // --- IMAGE COLUMN ---
  // Extract the primary (PC) device screenshot image, fallback to first image in the image column
  let image = null;
  if (imageCol) {
    image = imageCol.querySelector('img.js-pc, img.pc')
      || imageCol.querySelector('img:first-of-type')
      || imageCol.querySelector('img');
  }

  // Build image cell content
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  // --- TEXT COLUMN ---
  const textCell = [];

  if (textCol) {
    // Product icon image
    const productIcon = textCol.querySelector('.icon-product img, .icon img');
    if (productIcon) {
      textCell.push(productIcon);
    }

    // Product name (use js-pc span or first span in icon-product)
    const productName = textCol.querySelector('.icon-product .js-pc, .icon-product span:first-of-type');
    if (productName) {
      const p = document.createElement('p');
      p.textContent = productName.textContent.trim();
      textCell.push(p);
    }

    // Heading (h2, h1, h3 fallback)
    const heading = textCol.querySelector('h2, h1, h3');
    if (heading) {
      // Extract PC-specific text if platform spans exist, otherwise use full heading
      const pcSpan = heading.querySelector('.js-pc, span:first-of-type');
      if (pcSpan && heading.querySelectorAll('span[class*="js-"]').length > 1) {
        const h = document.createElement('h2');
        h.textContent = pcSpan.textContent.trim();
        textCell.push(h);
      } else {
        textCell.push(heading);
      }
    }

    // Description paragraph (body-3 class or general paragraph)
    const descContainer = textCol.querySelector('.body-3, .body, p:not(.icon-product p)');
    if (descContainer) {
      const pcDesc = descContainer.querySelector('.js-pc, span:first-of-type');
      if (pcDesc && descContainer.querySelectorAll('span[class*="js-"]').length > 1) {
        const p = document.createElement('p');
        p.textContent = pcDesc.textContent.trim();
        textCell.push(p);
      } else {
        const p = document.createElement('p');
        p.textContent = descContainer.textContent.trim();
        textCell.push(p);
      }
    }

    // CTA buttons - extract PC-specific buttons, fallback to all buttons
    const buttonsContainer = textCol.querySelector('.buttons, .cta, [class*="button"]');
    if (buttonsContainer) {
      const pcButtons = buttonsContainer.querySelectorAll('a.js-pc');
      const buttons = pcButtons.length > 0
        ? Array.from(pcButtons)
        : Array.from(buttonsContainer.querySelectorAll('a')).slice(0, 2);

      buttons.forEach((btn) => {
        const link = document.createElement('a');
        link.href = btn.href || btn.getAttribute('href') || '';
        link.textContent = btn.textContent.trim();
        // Preserve primary/outline distinction via strong/em
        if (btn.classList.contains('outline') || btn.classList.contains('secondary')) {
          const em = document.createElement('em');
          em.appendChild(link);
          textCell.push(em);
        } else {
          const strong = document.createElement('strong');
          strong.appendChild(link);
          textCell.push(strong);
        }
      });
    }
  }

  // --- DETERMINE COLUMN ORDER ---
  // Check if image is on the left or right based on source DOM order
  const row = element.querySelector('.row, .container > div, .container');
  let cells;

  if (row) {
    const firstChild = row.querySelector(':scope > div:first-child');
    const isImageFirst = firstChild && (
      firstChild.classList.contains('img')
      || firstChild.querySelector('img:not(.icon-product img)')
    );

    if (isImageFirst) {
      // Image left, text right
      cells = [[imageCell, textCell]];
    } else {
      // Text left, image right
      cells = [[textCell, imageCell]];
    }
  } else {
    // Default: image left, text right
    cells = [[imageCell, textCell]];
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
