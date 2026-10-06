import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const {
  default: AccordionGroup,
  AccordionRoot,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} = await loadComponent(new URL('../../../../src/components/core/Accordion/Accordion.jsx', import.meta.url));
const items = [
  {
    value: 'locked',
    title: 'Locked section',
    content: 'Restricted details',
    disabled: true
  },
  { value: 'profile', title: 'Profile', content: 'Profile details' },
  { value: 'access', title: 'Access', content: 'Access details' }
];

test('AccordionGroup starts with the first enabled item and names its panel', () => {
  const html = renderToStaticMarkup(h(AccordionGroup, { items }));
  assert.match(html, /<h3[^>]*><button/);
  assert.match(html, /disabled=""[^>]*>.*?Locked section/);
  assert.match(html, /Profile details/);
  assert.doesNotMatch(html, /Restricted details|Access details/);
  // IDs must be usable without the consumer manually wiring trigger/content pairs.
  const panel = html.match(
    /<div[^>]*data-state="open"[^>]*role="region"[^>]*>/
  )[0];
  const labelledBy = panel.match(/aria-labelledby="([^"]+)"/)[1];
  const openTrigger = html.match(/<button[^>]*aria-expanded="true"[^>]*>/)[0];
  assert.ok(openTrigger.includes(`id="${labelledBy}"`));
  const contentId = openTrigger.match(/aria-controls="([^"]+)"/)[1];
  assert.ok(panel.includes(`id="${contentId}"`));
  assert.doesNotMatch(html, /aria-describedby=/);
});

test('Accordion preserves explicitly empty and multiple initial states', () => {
  const closed = renderToStaticMarkup(
    h(AccordionGroup, { items, defaultValue: null })
  );
  assert.doesNotMatch(closed, /aria-expanded="true"|Profile details/);
  const multiple = renderToStaticMarkup(
    h(AccordionGroup, {
      items,
      type: 'multiple',
      defaultValue: ['profile', 'access']
    })
  );
  assert.equal((multiple.match(/aria-expanded="true"/g) || []).length, 2);
  const defaultMultiple = renderToStaticMarkup(
    h(AccordionGroup, { items, type: 'multiple' })
  );
  assert.equal(
    (defaultMultiple.match(/aria-expanded="true"/g) || []).length,
    1
  );
});

test('An explicitly undefined controlled value overrides the default', () => {
  const html = renderToStaticMarkup(
    h(AccordionGroup, { items, value: undefined, defaultValue: 'profile' })
  );
  assert.doesNotMatch(html, /aria-expanded="true"|Profile details/);
});

test('Compound composition generates unique IDs, heading levels, and rich slots', () => {
  const instance = () =>
    h(
      AccordionRoot,
      { defaultValue: 'profile', headingLevel: 2 },
      h(
        AccordionItem,
        { value: 'profile' },
        h(
          AccordionTrigger,
          { description: 'Manage your profile', badge: h('span', null, 'New') },
          'Profile'
        ),
        h(AccordionContent, null, 'Details')
      )
    );
  const html = renderToStaticMarkup(h('div', null, instance(), instance()));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal((html.match(/<h2/g) || []).length, 2);
  assert.match(html, /aria-describedby="[^"]+"/);
  assert.match(html, /New/);
});

test('Retained closed content is inaccessible and keeps its form markup', () => {
  const html = renderToStaticMarkup(
    h(AccordionGroup, {
      defaultValue: null,
      items: [
        {
          value: 'draft',
          title: 'Draft',
          content: h('input', {
            'aria-label': 'Draft name',
            defaultValue: 'Saved draft'
          }),
          forceMount: true
        }
      ]
    })
  );
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /inert=""/);
  assert.match(html, /data-retained="true"/);
  assert.match(html, /value="Saved draft"/);
});

test('The root supports disabling all items and forwarding consumer attributes', () => {
  const html = renderToStaticMarkup(
    h(AccordionGroup, {
      items,
      disabled: true,
      dir: 'rtl',
      'aria-label': 'Account settings',
      variant: 'framed'
    })
  );
  assert.equal((html.match(/ disabled=""/g) || []).length, 3);
  assert.match(html, /dir="rtl"/);
  assert.match(html, /aria-label="Account settings"/);
  assert.match(html, /data-variant="framed"/);
});
