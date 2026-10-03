//js placeholder for byline block

import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const row = block.firstElementChild;      // byline is a single-row block
  if (!row) return;

  const cells = [...row.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'byline';

  // Avatar = the cell whose only child is a <picture>
  const avatarCell = cells.find(
    (c) => c.children.length === 1 && c.querySelector('picture'),
  );
  if (avatarCell) {
    const avatar = document.createElement('div');
    avatar.className = 'byline-avatar';
    avatar.append(...avatarCell.childNodes);
    wrapper.append(avatar);
  }

  // Info = the remaining cell: first line is the name, the rest are meta
  const infoCell = cells.find((c) => c !== avatarCell);
  if (infoCell) {
    const info = document.createElement('div');
    info.className = 'byline-info';

    const lines = [...infoCell.children].filter((el) => el.textContent.trim());

    if (lines[0]) {
      const name = document.createElement('span');
      name.className = 'byline-name';
      name.append(...lines[0].childNodes);   // keeps an <a> if the author linked it
      info.append(name);
    }

    const metaLines = lines.slice(1);
    if (metaLines.length) {
      const meta = document.createElement('div');
      meta.className = 'byline-meta';
      metaLines.forEach((line) => {
        const item = document.createElement('span');
        item.className = 'byline-meta-item';
        item.append(...line.childNodes);
        meta.append(item);
      });
      info.append(meta);
    }
    wrapper.append(info);
  }

  // Optimize the avatar (small, non-eager — it's never the LCP image)
  wrapper.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '96' }]),
    );
  });

  block.replaceChildren(wrapper);
}