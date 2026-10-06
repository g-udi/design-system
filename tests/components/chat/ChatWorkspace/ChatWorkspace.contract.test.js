import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadComponent } from '../../../support/renderComponent.js';

const { ChatWorkspace } = await loadComponent(new URL('../../../../src/components/chat/ChatWorkspace/index.js', import.meta.url));
const items = { root: { name: 'Files', children: ['research'] }, research: { name: 'Research files', children: [] } };
const agents = [{ id: 'research-agent', name: 'Researcher', state: 'tool', fileRootId: 'research' }];
const render = (props) => renderToStaticMarkup(h(ChatWorkspace, props));

test('an existing empty agent folder remains reachable from the roster', () => {
  const html = render({ agents, defaultView: 'agents', fileExplorerProps: { items } });
  assert.match(html, /View files: Researcher/);
  assert.match(html, /Using a tool/);
  assert.match(html, /data-slot="agent-mark"/);
});

test('agent scope reuses the explorer and falls back to all files when the folder disappears', () => {
  const scoped = render({ agents, agentId: 'research-agent', fileExplorerProps: { items } });
  assert.match(scoped, /All files/);
  assert.match(scoped, /data-slot="chat-file-explorer" aria-label="Researcher"/);
  const removed = render({ agents, agentId: 'research-agent', fileExplorerProps: { items: { root: { name: 'Files', children: [] } } } });
  assert.doesNotMatch(removed, /All files/);
  assert.match(removed, /data-slot="chat-file-explorer" aria-label="Files"/);
});

test('a missing agent exposes the full workspace and empty roster explicitly', () => {
  assert.match(render({ agentId: 'removed' }), /No files yet/);
  assert.match(render({ defaultView: 'agents' }), /No agents yet/);
});
