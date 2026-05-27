/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AVG site-wide cleanup.
 * Removes non-authorable content (navigation, footer, cookie banners, sticky bars,
 * language selector modal, platform-switch wrappers for non-PC platforms).
 * All selectors verified against migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent banner (found at #ensNotifyBanner inside a <section>)
    WebImporter.DOMUtils.remove(element, [
      '#ensNotifyBanner',
      '#cheq-dev',
      '#ZN_8ksX2qGJaVxaYw6',
    ]);

    // Remove platform-switch wrapper divs for non-PC platforms
    // Keep .js-pc content, remove .js-mac, .js-android, .js-ios wrapper divs
    // These are direct children of .js-platform-switch or nested inside sections
    const nonPcWrappers = element.querySelectorAll('div.js-mac, div.js-android, div.js-ios');
    nonPcWrappers.forEach((wrapper) => {
      if (wrapper) wrapper.remove();
    });

    // Remove platform-specific spans (e.g. inside #top text sections)
    const nonPcSpans = element.querySelectorAll('span.js-mac, span.js-android, span.js-ios');
    nonPcSpans.forEach((span) => {
      if (span) span.remove();
    });
  }

  if (hookName === H.after) {
    // Remove non-authorable navigation and footer content
    WebImporter.DOMUtils.remove(element, [
      'nav#menu',
      '.global-navigation',
      'section.message-bar',
      '.sticky-bar',
      '#bottom',
      '#footer',
      '.language-selector.modal',
      '.bi-visibility-below-the-fold',
    ]);

    // Remove iframes (e.g. Trustpilot widget), link tags, noscript
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove empty parent section that contained the cookie banner
    const emptySections = element.querySelectorAll('section:empty');
    emptySections.forEach((sec) => {
      if (sec) sec.remove();
    });
  }
}
