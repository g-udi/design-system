import assert from 'node:assert/strict';
import test from 'node:test';
import { renderComponent } from '../../../support/renderComponent.js';

const source = new URL('../../../../src/components/mdx/Image/Image.js', import.meta.url);
const props = { src: '/static/images/posts/gaudi.svg', alt: 'Diagram', width: 420, height: 260 };

test('MDX Image uses Next Image and respects caller placeholder settings', async () => {
  const empty = await renderComponent(source, { ...props, placeholder: 'empty' });
  const blurred = await renderComponent(source, { ...props, blurDataURL: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' });
  assert.match(empty, /data-nimg="1"/);
  assert.doesNotMatch(empty, /background-image:/);
  assert.match(blurred, /background-image:/);
  assert.doesNotMatch(blurred, /blurDataURL=/);
});
