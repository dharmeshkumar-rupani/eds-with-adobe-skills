/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AVG section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * Runs only in afterTransform. Uses payload.template.sections from page-templates.json.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Sections (8 total):
 *   1. #top (style: dark)
 *   2. .section-usp-stripe (style: null)
 *   3. #media-1 (style: null)
 *   4. #awards-card (style: grey)
 *   5. #media-2 (style: null)
 *   6. #media-3 + .inverse.included (style: dark)
 *   7. #blogposts (style: null)
 *   8. #teaser (style: green)
 *
 * Expected: 7 section breaks (<hr>), 4 Section Metadata blocks (dark, grey, dark, green).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
    const doc = document || element.ownerDocument;

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first element matching the section selector
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add Section Metadata block after the section content if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // For array selectors, find the last element to insert metadata after
        if (Array.isArray(section.selector) && section.selector.length > 1) {
          let lastEl = null;
          for (const sel of section.selector) {
            const found = element.querySelector(sel);
            if (found) lastEl = found;
          }
          if (lastEl && lastEl.nextSibling) {
            lastEl.parentNode.insertBefore(sectionMetadata, lastEl.nextSibling);
          } else if (lastEl) {
            lastEl.parentNode.appendChild(sectionMetadata);
          }
        } else {
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
