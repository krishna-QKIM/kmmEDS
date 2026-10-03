import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'byline';

  const textLines = [];
  let avatarCell = null;

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!avatarCell && cell.children.length === 1 && cell.querySelector('picture')) {
        avatarCell = cell;
      } else {
        const paras = [...cell.children].filter((el) => el.textContent.trim());
        if (paras.length) {
          textLines.push(...paras);
        } else if (cell.textContent.trim()) {
          const p = document.createElement('p');
          p.append(...cell.childNodes);
          textLines.push(p);
        }
      }
    });
  });

  if (avatarCell) {
    const avatar = document.createElement('div');
    avatar.className = 'byline-avatar';
    avatar.append(...avatarCell.childNodes);
    wrapper.append(avatar);
  }

  if (textLines.length) {
    const info = document.createElement('div');
    info.className = 'byline-info';

    const name = document.createElement('span');
    name.className = 'byline-name';
    name.append(...textLines[0].childNodes);
    info.append(name);

    const metaLines = textLines.slice(1);
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

  wrapper.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '96' }]),
    );
  });

  block.replaceChildren(wrapper);
}
