import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import TableOfContents from '../../../../src/components/post/TableOfContents/index.js';

export async function checkHeadingHierarchy(canvasElement) {
  const [parent, child] = canvasElement.querySelectorAll('article h2, article h3');
  if (!parent || !child) return;
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  try {
    await act(() => root.render(createElement(TableOfContents, {
      indexVisuals: false,
      toc: [{ id: parent.id, value: parent.textContent, depth: 2 }, { id: child.id, value: child.textContent, depth: 3 }]
    })));
    const [parentLink, childLink] = host.querySelectorAll('a');
    expect(childLink.getBoundingClientRect().left).toBeGreaterThan(parentLink.getBoundingClientRect().left);
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
}
