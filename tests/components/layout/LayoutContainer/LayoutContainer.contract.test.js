import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent } from '../../../support/renderComponent.js';

const { default: LayoutContainer } = await loadComponent(new URL('../../../../src/components/layout/LayoutContainer/LayoutContainer.js', import.meta.url));
const descendants = (node) => {
  if (!node || typeof node !== 'object') return [];
  return [node, ...[node.props?.children].flat(Infinity).flatMap(descendants)];
};

test('the server layout awaits host JSON-LD, escapes script terminators, and uses the supplied theme', async () => {
  const jsonLd = async () => ({ name: '</script><script>alert(1)</script>' });
  const nodes = descendants(await LayoutContainer({ metadata: { theme: 'dark' }, jsonLd, children: 'Content' }));
  const theme = nodes.find(node => node.props?.attribute === 'class');
  assert.equal(theme.props.defaultTheme, 'dark');
  const structuredData = nodes.find(node => node.type === 'script');
  assert.equal(structuredData.props.type, 'application/ld+json');
  assert.ok(!structuredData.props.dangerouslySetInnerHTML.__html.includes('<'));
  assert.deepEqual(JSON.parse(structuredData.props.dangerouslySetInnerHTML.__html), await jsonLd());
  assert.equal(nodes.find(node => node.type === 'main').props.id, 'main-content');
});

test('unavailable or unserializable metadata does not prevent the layout from rendering', async () => {
  const circular = {}; circular.self = circular;
  for (const jsonLd of [() => { throw new Error('Unavailable'); }, circular, null]) {
    const nodes = descendants(await LayoutContainer({ jsonLd }));
    assert.equal(nodes.find(node => node.props?.attribute === 'class').props.defaultTheme, 'system');
    assert.equal(nodes.some(node => node.type === 'script'), false);
    assert.ok(nodes.some(node => node.type === 'main'));
  }
});
