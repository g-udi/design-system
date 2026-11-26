import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { lookupInspiration } from '../../cli/inspiration.mjs';

const bin = fileURLToPath(new URL('../../bin/gaudi-ds.mjs', import.meta.url));

test('public lookups negotiate MCP, read the matching item and preserve denied queries for catalog lookup', async (t) => {
  const methods = [];
  const requests = [];
  const item = { name: 'example-item', title: 'Example item' };
  t.mock.method(globalThis, 'fetch', async (input, options) => {
    assert.equal(options.credentials, 'omit');
    assert.equal(options.redirect, 'error');
    assert.ok(options.signal instanceof AbortSignal);
    const session = 'test-session';
    if (options.method === 'GET') return new Response(null, { status: 405 });
    if (options.method === 'DELETE') {
      assert.equal(options.headers.get('mcp-session-id'), session);
      return new Response(null, { status: 204 });
    }
    const message = JSON.parse(options.body);
    methods.push(message.method);
    if (message.method === 'initialize') {
      return Response.json({ jsonrpc: '2.0', id: message.id, result: {
        protocolVersion: message.params.protocolVersion, capabilities: { tools: {} },
        serverInfo: { name: 'test-publisher', version: '1' }
      } }, { headers: { 'mcp-session-id': session } });
    }
    assert.equal(options.headers.get('mcp-session-id'), session);
    if (message.method === 'notifications/initialized') return new Response(null, { status: 202 });
    assert.equal(message.method, 'tools/call');
    requests.push([new URL(input).href, message.params.name, message.params.arguments]);
    if (message.params.arguments.slug === 'members-only') return new Response(null, { status: 403 });
    if (message.params.arguments.query === 'no-match') {
      const byHost = {
        'www.affectui.com': 'Nothing matched "no-match". Try other words or list_components.',
        'mcp.beui.dev': '[]',
        'mcp.shoogle.dev': '{"items":[],"totalResults":0}'
      };
      return Response.json({ jsonrpc: '2.0', id: message.id, result: { content: [{ type: 'text', text: byHost[new URL(input).host] }] } });
    }
    return Response.json({ jsonrpc: '2.0', id: message.id, result: { content: [{ type: 'text', text: JSON.stringify(item) }] } });
  });

  for (const [provider, action, query] of [['beui', 'item', 'example-item'], ['affectui', 'search', 'agent trail'], ['shoogle', 'search', 'sortable']]) {
    assert.deepEqual(await lookupInspiration(provider, action, query), { provider, action, source: 'mcp', data: item });
  }
  const denied = await lookupInspiration('beui', 'item', 'members-only');
  assert.equal(denied.source, 'catalog-fallback');
  assert.equal(denied.catalog, 'https://beui.dev/r');
  assert.equal(denied.query, 'members-only');
  assert.match(denied.reason, /403/);
  assert.deepEqual(methods, Array.from({ length: 4 }, () => ['initialize', 'notifications/initialized', 'tools/call']).flat());
  assert.deepEqual(requests, [
    ['https://mcp.beui.dev/mcp', 'get_component', { slug: 'example-item' }],
    ['https://www.affectui.com/api/mcp', 'search_components', { query: 'agent trail' }],
    ['https://mcp.shoogle.dev/mcp', 'search_registry_items', { query: 'sortable', limit: 8 }],
    ['https://mcp.beui.dev/mcp', 'get_component', { slug: 'members-only' }]
  ]);
  for (const provider of ['affectui', 'beui', 'shoogle']) {
    const miss = await lookupInspiration(provider, 'search', 'no-match');
    assert.equal(miss.source, 'catalog-fallback');
    assert.equal(miss.query, 'no-match');
  }
});

test('providers using host access or a public catalog return a publisher handoff without network access', async (t) => {
  const network = t.mock.method(globalThis, 'fetch');
  const { componentCatalogs } = JSON.parse(readFileSync(new URL('../../ai/setup.json', import.meta.url)));
  const deepLinks = {
    reui: 'https://reui.io/llms.txt', 'cult-ui': 'https://www.cult-ui.com/llms.txt', 'arc-ui': 'https://uiarc.dev/llms.txt',
    'orb-ui': 'https://orb-ui.com/docs', 'skiper-ui': 'https://skiper-ui.com/components', shoogle: 'https://shoogle.dev/search'
  };
  for (const [provider, home] of Object.entries(componentCatalogs)) {
    if (['affectui', 'beui'].includes(provider)) continue;
    const catalog = deepLinks[provider] ?? home;
    const lookup = await lookupInspiration(provider, 'item', 'example');
    assert.deepEqual([lookup.source, lookup.provider, lookup.action, lookup.catalog, lookup.query],
      ['catalog-fallback', provider, 'item', catalog, 'example']);
    assert.ok(lookup.reason);
  }
  assert.equal(network.mock.callCount(), 0);
});

test('the CLI supports queries with spaces and rejects unknown providers', () => {
  const cli = (...args) => spawnSync(process.execPath, [bin, 'inspiration', ...args], { cwd: tmpdir(), encoding: 'utf8' });
  const result = cli('reui', 'search', 'pinned', 'columns');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).query, 'pinned columns');
  const invalid = cli('unknown', 'item', 'example');
  assert.equal(invalid.status, 1);
  assert.equal(invalid.stdout, '');
  assert.match(invalid.stderr, /Unknown inspiration provider/);
});
