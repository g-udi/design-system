import test from 'node:test';
import assert from 'node:assert/strict';
import { fenceMeta, remarkCode } from './remark.js';

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
