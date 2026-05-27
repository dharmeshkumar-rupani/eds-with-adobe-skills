/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-blog
 * Base block: carousel
 * Source: https://www.avg.com/en-us/homepage
 * Selector: .carousel-slider.blog-slider
 * Generated: 2026-05-21
 *
 * Container block: each slide is one row with 2 columns:
 *   Column 1: media_image (thumbnail image)
 *   Column 2: content_text (title + excerpt + CTA link)
 */
export default function parse(element, { document }) {
  // Find all slide items (anchor elements with class tns-item inside the slider)
  const slides = element.querySelectorAll('.tns-slider a.tns-item, .tns-slider [class*="tns-item"]');

  // Fallback: if no slides found via tns-item, try direct anchor children of the slider div
  const slideItems = slides.length > 0
    ? Array.from(slides)
    : Array.from(element.querySelectorAll('.tns-slider > a'));

  const cells = [];

  slideItems.forEach((slide) => {
    // Column 1: media_image (image with alt text)
    const img = slide.querySelector('img');
    const mediaCell = document.createDocumentFragment();
    mediaCell.appendChild(document.createComment(' field:media_image '));
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      mediaCell.appendChild(newImg);
    }

    // Column 2: content_text (heading + excerpt + CTA link as richtext)
    const title = slide.querySelector('h4.blog-title, h4, h3, [class*="title"]');
    const excerpt = slide.querySelector('p.blog-perex, p');
    const href = slide.getAttribute('href') || '';

    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content_text '));

    if (title) {
      const h4 = document.createElement('h4');
      h4.textContent = title.textContent.trim();
      contentCell.appendChild(h4);
    }

    if (excerpt) {
      const p = document.createElement('p');
      p.textContent = excerpt.textContent.trim();
      contentCell.appendChild(p);
    }

    // Create a CTA link from the slide's href
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read More';
      contentCell.appendChild(link);
    }

    cells.push([mediaCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-blog', cells });
  element.replaceWith(block);
}
