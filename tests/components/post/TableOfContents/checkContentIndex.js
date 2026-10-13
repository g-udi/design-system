import { expect } from 'storybook/test';
import { collectVisuals } from '../../../../src/components/post/TableOfContents/contentIndex.js';

export function checkContentIndex(canvasElement) {
  const host = document.createElement('div');
  host.innerHTML = '<article><figure><figcaption>Shared diagram</figcaption><svg></svg></figure><figure><img src="/static/images/art/0.svg" alt="A photo"/><figcaption>A photo caption</figcaption></figure></article><article><figure><figcaption>Shared diagram</figcaption><svg></svg></figure><table><caption>Scoped table</caption></table></article>';
  canvasElement.append(host);
  try {
    const [firstArticle, secondArticle] = host.querySelectorAll('article');
    const first = collectVisuals(firstArticle);
    const second = collectVisuals(secondArticle);
    expect(first.map(entry => entry.kind)).toEqual(['diagram']);
    expect(second.map(entry => entry.kind)).toEqual(['diagram', 'table']);
    expect(first[0].id).not.toBe(second[0].id);
    expect(second[1].label).toBe('Scoped table');
    expect(collectVisuals(secondArticle).map(entry => entry.id)).toEqual(second.map(entry => entry.id));
  } finally { host.remove(); }
}
