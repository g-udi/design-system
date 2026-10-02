import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { catalogueFromIndex, filterCatalogue } from '../../.storybook/stories/catalogueModel.js';

import { navigationPages, isNavigationPage, isSidebarEntry } from '../../.storybook/navigation.js';

const index = JSON.parse(await readFile(new URL('../../.storybook/fixtures/catalogue.json', import.meta.url)));
const coverage = JSON.parse(await readFile(new URL('../../.storybook/fixtures/patterns/coverage.json', import.meta.url)));
const owners = catalogueFromIndex(index);

test('the flat catalogue preserves every curated example and original component families', () => {
  const ids = new Set(owners.flatMap(owner => owner.examples.map(example => example.id)));
  for (const family of Object.values(coverage.categories)) {
    for (const example of family.examples) assert.ok(ids.has(example.storyId), `Missing ${example.storyId}`);
  }
  for (const name of ['Core/Avatar','Core/Overlays & Menus/Dialog','MDX/Footnote','Blocks/App Shell']) assert.ok(owners.some(owner => owner.key === name), name);
  assert.ok(!owners.some(owner => owner.category === 'Overview'));
});

test('component docs and all extended avatar examples stay together', () => {
  const avatar = filterCatalogue(owners, {owner:'Core/Avatar'});
  assert.equal(avatar.length, 1);
  assert.equal(avatar[0].docs, 'core-avatar--docs');
  assert.equal(avatar[0].examples.length, 15);
  assert.ok(avatar[0].examples.some(example => example.id === 'core-avatar--playground'));
});

test('every curated example participates in its owner documentation page', () => {
  const entries = Object.values(index.entries);
  for (const family of Object.values(coverage.categories)) {
    for (const example of family.examples) {
      const story = index.entries[example.storyId];
      assert.ok(story.tags.includes('autodocs'), `Excluded from docs: ${story.id}`);
      assert.ok(entries.some(entry => entry.type === 'docs' && entry.title === story.title), `Missing owner docs: ${story.title}`);
    }
  }
});

test('original component documentation owns merged pages', () => {
  for (const name of ['Select', 'Skeleton', 'Spinner', 'Switch', 'Button', 'Avatar', 'Breadcrumb', 'Pagination', 'NavigationMenu']) {
    const docs = index.entries[`core-${name.toLowerCase()}--docs`];
    assert.ok(docs.importPath.endsWith(`/${name}.stories.jsx`), docs.importPath);
  }
  // Catalogues share their owner's title, so each component has exactly one docs page.
  const merged = {
    'core-breadcrumb--breadcrumb-pattern-1': 'Core/Navigation/Breadcrumb',
    'core-pagination--pagination-pattern-1': 'Core/Navigation/Pagination',
    'core-navigationmenu--navigation-menu-pattern-1': 'Core/Navigation/NavigationMenu',
    'core-kanban--kanban-pattern-1': 'Core/Planning/Kanban',
    'core-item--item-pattern-1': 'Core/Data Display/Item',
    'blocks-application-appshell--sidebar-pattern-1': 'Blocks/App Shell'
  };
  for (const [id, title] of Object.entries(merged)) assert.equal(index.entries[id]?.title, title, id);
  const docsTitles = Object.values(index.entries).filter(entry => entry.type === 'docs').map(entry => entry.title);
  assert.equal(new Set(docsTitles).size, docsTitles.length);
  for (const title of ['Blocks/KanbanBoard', 'Blocks/Navigation/Sidebar', 'Blocks/Navigation/Breadcrumb', 'Blocks/Navigation/Pagination', 'Blocks/Navigation/Navigation Menu']) {
    assert.ok(!docsTitles.includes(title), `Stale catalogue page: ${title}`);
  }
});

test('use-case search finds matching examples and respects area filters', () => {
  const results = filterCatalogue(owners, {query:'spreadsheet editing'});
  assert.ok(results.some(owner => owner.examples.some(example=>example.id === 'core-datatable--data-grid-pattern-31')));
  assert.equal(filterCatalogue(owners, {query:'spreadsheet editing',category:'MDX'}).length, 0);
});


test('navigation exposes seven flat guides and keeps every component in the sidebar', () => {
  assert.deepEqual(navigationPages.map(page => page.title), ['Getting Started', 'Accessibility', 'Colors & Tokens', 'Icons', 'Indicators', 'States & Recovery', 'Typography']);
  for (const page of navigationPages) {
    assert.equal(index.entries[page.id].title, page.title);
    assert.equal(index.entries[page.id].name, page.title);
  }
  assert.equal(Object.values(index.entries).filter(isNavigationPage).length, 7);
  const visibleIds = new Set(Object.values(index.entries).filter(isSidebarEntry).map(entry => entry.id));
  for (const page of navigationPages) assert.ok(visibleIds.has(page.id), page.title);
  for (const owner of owners) {
    if (owner.docs) assert.ok(visibleIds.has(owner.docs), `Hidden docs: ${owner.docs}`);
    for (const example of owner.examples) assert.ok(visibleIds.has(example.id), `Hidden example: ${example.id}`);
  }
  assert.ok(Object.values(index.entries).some(entry => entry.title.startsWith('Overview')));
  for (const entry of Object.values(index.entries)) {
    if (!isNavigationPage(entry) && (entry.title.startsWith('Overview') || !entry.title.includes('/'))) {
      assert.equal(isSidebarEntry(entry), false, `Redundant overview: ${entry.id}`);
    }
  }
});
