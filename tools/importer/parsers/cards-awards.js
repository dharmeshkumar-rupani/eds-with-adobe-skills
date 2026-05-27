/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-awards
 * Base block: cards
 * Source: https://www.avg.com/en-us/homepage
 * Selector: #awards-card
 * Generated: 2026-05-21
 *
 * Structure: Centered trophy icon, heading, description, then 3 award badge cards
 * each with award image and text (year + bold title).
 *
 * UE Model (card): image (reference) + text (richtext)
 */
export default function parse(element, { document }) {
  // Extract the main intro content
  const trophyImg = element.querySelector('.card > .wrapper > img, .wrapper > img');
  const heading = element.querySelector('h2');
  const description = element.querySelector('.body-2');

  // Extract award badge items
  const awardIcons = element.querySelectorAll('.awards-icon');

  const cells = [];

  // Row 1: Intro card - trophy image in image column, heading + description in text column
  const introTextCell = [];
  if (heading) introTextCell.push(heading);
  if (description) introTextCell.push(description);
  cells.push([trophyImg || '', introTextCell]);

  // Rows 2-4: One row per award badge
  awardIcons.forEach((awardIcon) => {
    const awardImg = awardIcon.querySelector('img');
    const awardText = awardIcon.querySelector('.body-2');
    cells.push([awardImg || '', awardText || '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-awards', cells });
  element.replaceWith(block);
}
