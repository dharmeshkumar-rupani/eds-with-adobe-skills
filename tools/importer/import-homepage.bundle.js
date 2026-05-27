/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-product.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(":scope > img") || element.querySelector(':scope > picture img, :scope > picture, :scope > .img img, img.hero-bg, img[class*="background"]');
    const heading = element.querySelector(".span9.text h1, .text h1, h1");
    const description = element.querySelector(".body-1.top-text, .top-text, .text > p");
    const ctaButton = element.querySelector(".js-pc a.button, .button-wrapper .js-pc a, a.button.primary");
    const platformLinks = element.querySelector(".top-hint .js-pc.body-3, .top-hint-item-1 .js-pc.body-3");
    const awardBadge = element.querySelector(".top-hint-award");
    const cells = [];
    if (bgImage) {
      cells.push([[bgImage]]);
    }
    const textContainer = document.createElement("div");
    if (heading) {
      textContainer.appendChild(heading);
    }
    if (description) {
      textContainer.appendChild(description);
    }
    if (ctaButton) {
      const ctaParagraph = document.createElement("p");
      const ctaClone = ctaButton.cloneNode(true);
      ctaClone.textContent = ctaClone.textContent.trim();
      ctaParagraph.appendChild(ctaClone);
      textContainer.appendChild(ctaParagraph);
    }
    if (platformLinks) {
      const platformParagraph = document.createElement("p");
      platformParagraph.innerHTML = platformLinks.innerHTML;
      textContainer.appendChild(platformParagraph);
    }
    if (awardBadge) {
      textContainer.appendChild(awardBadge);
    }
    cells.push([[textContainer]]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stripe.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll(".usp-stripe-item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      const span = item.querySelector("span");
      const imageCell = [];
      if (img) {
        const picture = document.createElement("picture");
        const picImg = document.createElement("img");
        picImg.src = img.src;
        picImg.alt = img.alt || "";
        picture.appendChild(picImg);
        imageCell.push(picture);
      }
      const textCell = [];
      if (span) {
        const p = document.createElement("p");
        p.textContent = span.textContent.trim();
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stripe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse3(element, { document }) {
    const imageCol = element.querySelector('.span6.img, .img, [class*="img"]');
    const textCol = element.querySelector('.span6.text, .text, [class*="text"]:not([class*="body"])');
    let image = null;
    if (imageCol) {
      image = imageCol.querySelector("img.js-pc, img.pc") || imageCol.querySelector("img:first-of-type") || imageCol.querySelector("img");
    }
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
    const textCell = [];
    if (textCol) {
      const productIcon = textCol.querySelector(".icon-product img, .icon img");
      if (productIcon) {
        textCell.push(productIcon);
      }
      const productName = textCol.querySelector(".icon-product .js-pc, .icon-product span:first-of-type");
      if (productName) {
        const p = document.createElement("p");
        p.textContent = productName.textContent.trim();
        textCell.push(p);
      }
      const heading = textCol.querySelector("h2, h1, h3");
      if (heading) {
        const pcSpan = heading.querySelector(".js-pc, span:first-of-type");
        if (pcSpan && heading.querySelectorAll('span[class*="js-"]').length > 1) {
          const h = document.createElement("h2");
          h.textContent = pcSpan.textContent.trim();
          textCell.push(h);
        } else {
          textCell.push(heading);
        }
      }
      const descContainer = textCol.querySelector(".body-3, .body, p:not(.icon-product p)");
      if (descContainer) {
        const pcDesc = descContainer.querySelector(".js-pc, span:first-of-type");
        if (pcDesc && descContainer.querySelectorAll('span[class*="js-"]').length > 1) {
          const p = document.createElement("p");
          p.textContent = pcDesc.textContent.trim();
          textCell.push(p);
        } else {
          const p = document.createElement("p");
          p.textContent = descContainer.textContent.trim();
          textCell.push(p);
        }
      }
      const buttonsContainer = textCol.querySelector('.buttons, .cta, [class*="button"]');
      if (buttonsContainer) {
        const pcButtons = buttonsContainer.querySelectorAll("a.js-pc");
        const buttons = pcButtons.length > 0 ? Array.from(pcButtons) : Array.from(buttonsContainer.querySelectorAll("a")).slice(0, 2);
        buttons.forEach((btn) => {
          const link = document.createElement("a");
          link.href = btn.href || btn.getAttribute("href") || "";
          link.textContent = btn.textContent.trim();
          if (btn.classList.contains("outline") || btn.classList.contains("secondary")) {
            const em = document.createElement("em");
            em.appendChild(link);
            textCell.push(em);
          } else {
            const strong = document.createElement("strong");
            strong.appendChild(link);
            textCell.push(strong);
          }
        });
      }
    }
    const row = element.querySelector(".row, .container > div, .container");
    let cells;
    if (row) {
      const firstChild = row.querySelector(":scope > div:first-child");
      const isImageFirst = firstChild && (firstChild.classList.contains("img") || firstChild.querySelector("img:not(.icon-product img)"));
      if (isImageFirst) {
        cells = [[imageCell, textCell]];
      } else {
        cells = [[textCell, imageCell]];
      }
    } else {
      cells = [[imageCell, textCell]];
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-awards.js
  function parse4(element, { document }) {
    const trophyImg = element.querySelector(".card > .wrapper > img, .wrapper > img");
    const heading = element.querySelector("h2");
    const description = element.querySelector(".body-2");
    const awardIcons = element.querySelectorAll(".awards-icon");
    const cells = [];
    const introTextCell = [];
    if (heading) introTextCell.push(heading);
    if (description) introTextCell.push(description);
    cells.push([trophyImg || "", introTextCell]);
    awardIcons.forEach((awardIcon) => {
      const awardImg = awardIcon.querySelector("img");
      const awardText = awardIcon.querySelector(".body-2");
      cells.push([awardImg || "", awardText || ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-awards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse5(element, { document }) {
    const sectionHeading = element.querySelector(".included-title .h4, .included-title h4, .row.included-title .h4");
    const cards = Array.from(element.querySelectorAll(".included-card"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(":scope > img, :scope img");
      const heading = card.querySelector(".included-card-body .h5, .included-card-body h5");
      const description = card.querySelector(".included-card-body .body-3, .included-card-body p");
      const link = card.querySelector(":scope > a.link, :scope > a");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        imageCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (heading) {
        const h5 = document.createElement("h5");
        h5.textContent = heading.textContent;
        textCell.appendChild(h5);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent;
        textCell.appendChild(p);
      }
      if (link) {
        const a = document.createElement("a");
        a.href = link.getAttribute("href") || link.href || "";
        a.textContent = link.textContent.trim();
        textCell.appendChild(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    if (sectionHeading) {
      const headingEl = document.createElement("h4");
      headingEl.textContent = sectionHeading.textContent;
      element.replaceWith(headingEl, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/carousel-blog.js
  function parse6(element, { document }) {
    const slides = element.querySelectorAll('.tns-slider a.tns-item, .tns-slider [class*="tns-item"]');
    const slideItems = slides.length > 0 ? Array.from(slides) : Array.from(element.querySelectorAll(".tns-slider > a"));
    const cells = [];
    slideItems.forEach((slide) => {
      const img = slide.querySelector("img");
      const mediaCell = document.createDocumentFragment();
      mediaCell.appendChild(document.createComment(" field:media_image "));
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        mediaCell.appendChild(newImg);
      }
      const title = slide.querySelector('h4.blog-title, h4, h3, [class*="title"]');
      const excerpt = slide.querySelector("p.blog-perex, p");
      const href = slide.getAttribute("href") || "";
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(" field:content_text "));
      if (title) {
        const h4 = document.createElement("h4");
        h4.textContent = title.textContent.trim();
        contentCell.appendChild(h4);
      }
      if (excerpt) {
        const p = document.createElement("p");
        p.textContent = excerpt.textContent.trim();
        contentCell.appendChild(p);
      }
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = "Read More";
        contentCell.appendChild(link);
      }
      cells.push([mediaCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-blog", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/avg-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#ensNotifyBanner",
        "#cheq-dev",
        "#ZN_8ksX2qGJaVxaYw6"
      ]);
      const nonPcWrappers = element.querySelectorAll("div.js-mac, div.js-android, div.js-ios");
      nonPcWrappers.forEach((wrapper) => {
        if (wrapper) wrapper.remove();
      });
      const nonPcSpans = element.querySelectorAll("span.js-mac, span.js-android, span.js-ios");
      nonPcSpans.forEach((span) => {
        if (span) span.remove();
      });
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "nav#menu",
        ".global-navigation",
        "section.message-bar",
        ".sticky-bar",
        "#bottom",
        "#footer",
        ".language-selector.modal",
        ".bi-visibility-below-the-fold"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "link",
        "noscript"
      ]);
      const emptySections = element.querySelectorAll("section:empty");
      emptySections.forEach((sec) => {
        if (sec) sec.remove();
      });
    }
  }

  // tools/importer/transformers/avg-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const doc = document || element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
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
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-product": parse,
    "cards-stripe": parse2,
    "columns-media": parse3,
    "cards-awards": parse4,
    "cards-feature": parse5,
    "carousel-blog": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AVG main homepage with hero, product features, and call-to-action sections",
    urls: [
      "https://www.avg.com/en-us/homepage"
    ],
    blocks: [
      {
        name: "hero-product",
        instances: ["#top"]
      },
      {
        name: "cards-stripe",
        instances: [".section-usp-stripe"]
      },
      {
        name: "columns-media",
        instances: ["#media-1", "#media-2", "#media-3"]
      },
      {
        name: "cards-awards",
        instances: ["#awards-card"]
      },
      {
        name: "cards-feature",
        instances: [".inverse.included"]
      },
      {
        name: "carousel-blog",
        instances: [".carousel-slider.blog-slider"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Section",
        selector: "#top",
        style: "dark",
        blocks: ["hero-product"],
        defaultContent: []
      },
      {
        id: "section-2-usp",
        name: "USP Stripe Section",
        selector: ".section-usp-stripe",
        style: null,
        blocks: ["cards-stripe"],
        defaultContent: []
      },
      {
        id: "section-3-free-antivirus",
        name: "Free Antivirus Feature",
        selector: "#media-1",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-4-awards",
        name: "Awards Section",
        selector: "#awards-card",
        style: "grey",
        blocks: ["cards-awards"],
        defaultContent: []
      },
      {
        id: "section-5-internet-security",
        name: "Internet Security Feature",
        selector: "#media-2",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-6-ultimate",
        name: "AVG Ultimate Section",
        selector: ["#media-3", ".inverse.included"],
        style: "dark",
        blocks: ["columns-media", "cards-feature"],
        defaultContent: []
      },
      {
        id: "section-7-blog",
        name: "Blog Posts Section",
        selector: "#blogposts",
        style: null,
        blocks: ["carousel-blog"],
        defaultContent: ["#blogposts .row.blog .title h2", "#blogposts .row.blog .link-all a"]
      },
      {
        id: "section-8-teaser",
        name: "CTA Teaser Section",
        selector: "#teaser",
        style: "green",
        blocks: [],
        defaultContent: ["#teaser .ico img", "#teaser .ico p", "#teaser .js-pc a"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
