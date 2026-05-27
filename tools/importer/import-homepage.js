/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroProductParser from './parsers/hero-product.js';
import cardsStripeParser from './parsers/cards-stripe.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsAwardsParser from './parsers/cards-awards.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import carouselBlogParser from './parsers/carousel-blog.js';

// TRANSFORMER IMPORTS
import avgCleanupTransformer from './transformers/avg-cleanup.js';
import avgSectionsTransformer from './transformers/avg-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-product': heroProductParser,
  'cards-stripe': cardsStripeParser,
  'columns-media': columnsMediaParser,
  'cards-awards': cardsAwardsParser,
  'cards-feature': cardsFeatureParser,
  'carousel-blog': carouselBlogParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'AVG main homepage with hero, product features, and call-to-action sections',
  urls: [
    'https://www.avg.com/en-us/homepage'
  ],
  blocks: [
    {
      name: 'hero-product',
      instances: ['#top']
    },
    {
      name: 'cards-stripe',
      instances: ['.section-usp-stripe']
    },
    {
      name: 'columns-media',
      instances: ['#media-1', '#media-2', '#media-3']
    },
    {
      name: 'cards-awards',
      instances: ['#awards-card']
    },
    {
      name: 'cards-feature',
      instances: ['.inverse.included']
    },
    {
      name: 'carousel-blog',
      instances: ['.carousel-slider.blog-slider']
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Section',
      selector: '#top',
      style: 'dark',
      blocks: ['hero-product'],
      defaultContent: []
    },
    {
      id: 'section-2-usp',
      name: 'USP Stripe Section',
      selector: '.section-usp-stripe',
      style: null,
      blocks: ['cards-stripe'],
      defaultContent: []
    },
    {
      id: 'section-3-free-antivirus',
      name: 'Free Antivirus Feature',
      selector: '#media-1',
      style: null,
      blocks: ['columns-media'],
      defaultContent: []
    },
    {
      id: 'section-4-awards',
      name: 'Awards Section',
      selector: '#awards-card',
      style: 'grey',
      blocks: ['cards-awards'],
      defaultContent: []
    },
    {
      id: 'section-5-internet-security',
      name: 'Internet Security Feature',
      selector: '#media-2',
      style: null,
      blocks: ['columns-media'],
      defaultContent: []
    },
    {
      id: 'section-6-ultimate',
      name: 'AVG Ultimate Section',
      selector: ['#media-3', '.inverse.included'],
      style: 'dark',
      blocks: ['columns-media', 'cards-feature'],
      defaultContent: []
    },
    {
      id: 'section-7-blog',
      name: 'Blog Posts Section',
      selector: '#blogposts',
      style: null,
      blocks: ['carousel-blog'],
      defaultContent: ['#blogposts .row.blog .title h2', '#blogposts .row.blog .link-all a']
    },
    {
      id: 'section-8-teaser',
      name: 'CTA Teaser Section',
      selector: '#teaser',
      style: 'green',
      blocks: [],
      defaultContent: ['#teaser .ico img', '#teaser .ico p', '#teaser .js-pc a']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  avgCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [avgSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
