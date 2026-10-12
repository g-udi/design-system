import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../support/renderComponent.js';
import { fenceMeta, remarkCode } from '../../../src/components/mdx/remark.js';

const text = (value) => ({ type: 'paragraph', children: [{ type: 'text', value }] });
const code = (lang, meta, value = 'x') => ({ type: 'code', lang, meta, value });

test('fence meta from articles becomes CodeFence attributes', () => {
  assert.deepEqual(fenceMeta('title="next.config.mjs"'), { 'data-title': 'next.config.mjs' });
  assert.deepEqual(fenceMeta('caption="layoutContainer.js" {2,3,6,10,11,14}'), { 'data-title': 'layoutContainer.js', 'data-highlight': '2,3,6,10,11,14' });
  assert.deepEqual(fenceMeta('{4} showLineNumbers'), { 'data-highlight': '4', 'data-line-numbers': '' });
  assert.deepEqual(fenceMeta('showLineNumbers{12}'), { 'data-line-numbers': '', 'data-start-line': '12' });
  assert.deepEqual(fenceMeta('src/app/rsc/page.tsx'), { 'data-title': 'src/app/rsc/page.tsx' });
  assert.deepEqual(fenceMeta('/age/#v /name/#v /"Taylor"/#i'), { 'data-words': JSON.stringify(['age', 'name', '"Taylor"']) });
  assert.deepEqual(fenceMeta(null), {});
});

test('code-group directives wrap their fences in one CodeGroup titled by the labels', () => {
  const tree = {
    type: 'root',
    children: [
      text('Intro'),
      text('::: code-group labels=[Data/RDF, Query/SPARQL]'),
      code('xml', null),
      code('sparql', 'title="query.rq"'),
      text(':::'),
      code('js', '{1}')
    ]
  };
  remarkCode()(tree);
  assert.equal(tree.children.length, 3);
  const [, group, fence] = tree.children;
  assert.equal(group.type, 'mdxJsxFlowElement');
  assert.equal(group.name, 'CodeGroup');
  assert.deepEqual(group.children.map((child) => child.data.hProperties['data-title']), ['Data/RDF', 'query.rq']);
  assert.equal(fence.data.hProperties['data-highlight'], '1');
});

test('an unclosed code-group leaves the content untouched', () => {
  const tree = { type: 'root', children: [text('::: code-group labels=[A]'), code('js', null)] };
  remarkCode()(tree);
  assert.equal(tree.children[0].type, 'paragraph');
});


test('MDX fences preserve a zero-based starting line through the Core renderer', async () => {
  const { CodeFence } = await loadComponent(new URL('../../../src/components/mdx/Code/Code.jsx', import.meta.url));
  const html = renderToStaticMarkup(createElement(CodeFence, {}, createElement('code', {
    ...fenceMeta('showLineNumbers{0}')
  }, 'first\nsecond')));
  assert.match(html, /data-code-line="0"/);
  assert.match(html, /data-code-line="1"/);
  assert.doesNotMatch(html, /data-code-line="2"/);
});

 test('code groups preserve metadata supplied by earlier authoring plugins', () => {
  const fence = code('js', '{1}');
  fence.data = { hProperties: { 'data-title': 'legacy.js', 'data-custom': 'kept' } };
  const tree = { type: 'root', children: [text('::: code-group labels=[Fallback]'), fence, text(':::')] };
  remarkCode()(tree);
  assert.deepEqual(tree.children[0].children[0].data.hProperties, {
    'data-title': 'legacy.js', 'data-custom': 'kept', 'data-highlight': '1'
  });
});
