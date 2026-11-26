import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { loadMetadata } from '../../cli/metadata.mjs';
import { createServer } from '../../cli/server.mjs';

const bin = fileURLToPath(new URL('../../bin/gaudi-ds.mjs', import.meta.url));

test('a consumer without local registry files receives the hosted block source URL', async () => {
  const root = fileURLToPath(new URL('../fixtures/package-consumer/', import.meta.url));
  const server = createServer({ ...loadMetadata(), root });
  const client = new Client({ name: 'gaudi-consumer', version: '1.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  try {
    await client.connect(clientTransport);
    const block = await client.callTool({ name: 'get_block', arguments: { name: 'screens-account-settings' } });
    assert.ok(!block.isError);
    assert.ok(block.content[0].text.includes('https://design.gaudi.site/r/screens-account-settings.json'));
  } finally {
    await client.close();
    await server.close();
  }
});

test('the stdio MCP server lists its tools and answers calls', async () => {
  const client = new Client({ name: 'gaudi-smoke', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [bin, 'mcp'] }));
  try {
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map((tool) => tool.name).sort(), ['export_theme', 'get_agent_skill', 'get_block', 'get_component', 'get_examples', 'get_install_command', 'get_project_setup', 'get_theme', 'get_tokens', 'import_theme', 'list_blocks', 'list_components', 'list_themes', 'search', 'validate_usage']);
    const { prompts } = await client.listPrompts();
    assert.deepEqual(prompts.map((prompt) => prompt.name), ['build']);

    const text = async (name, args = {}) => (await client.callTool({ name, arguments: args })).content[0].text;
    assert.equal(JSON.parse(await text('search', { query: 'button', limit: 3 }))[0].id, 'core-button');
    assert.match(await text('get_component', { name: 'Dialog' }), /## Props[\s\S]*closeLabel/);
    const install = JSON.parse(await text('get_install_command', { name: 'screens-account-settings' }));
    assert.match(install.registry, /shadcn@latest add @gaudi\/screens-account-settings/);
    assert.equal(install.registriesConfig.registries['@gaudi'], 'https://design.gaudi.site/r/{name}.json');
    assert.match(await text('get_install_command', { name: 'Button' }), /import Button from '@gaudi\/design-system\/core\/Button'/);
    assert.equal(JSON.parse(await text('validate_usage', { code: "import { Nope } from '@gaudi/design-system';" })).valid, false);
    const overview = await text('get_agent_skill');
    assert.match(overview, /name: gaudi-design-system/);
    assert.match(overview, /component-design/);
    assert.equal(await text('get_agent_skill', { topic: 'overview' }), overview);
    const discovery = await text('get_agent_skill', { topic: 'component-design' });
    assert.equal(discovery, readFileSync(new URL('../../skills/gaudi-design-system/references/component-design.md', import.meta.url), 'utf8'));
    const bookmarks = discovery.split('<!-- BEGIN bookmarks from Credits -->')[1].split('<!-- END bookmarks from Credits -->')[0];
    const hosts = [...bookmarks.matchAll(/^- \[[^\]]+\]\((https:\/\/[^)]+)\)/gm)].map(([, url]) => new URL(url).hostname.replace(/^www\./, ''));
    for (const host of ['affectui.com', 'orb-ui.com', 'cult-ui.com', 'reui.io', 'beui.dev', 'uiarc.dev', 'skiper-ui.com']) {
      assert.equal(hosts.filter((candidate) => candidate === host).length, 1, host);
    }
    const build = await client.getPrompt({ name: 'build', arguments: { task: 'Design a sortable list' } });
    assert.match(build.messages[0].content.text, /call get_agent_skill[^\n]*component-design[^\n]*automatically consult one relevant bookmark/);
    assert.match(build.messages[0].content.text, /For offline or local-only requests,[^\n]*Skip publisher lookups and network requests/);
    assert.equal(JSON.parse(await text('get_tokens', { kind: 'spacing' })).scales.default, 1);
    assert.ok(JSON.parse(await text('list_themes')).themes.some((theme) => theme.id === 'gaudi'));
    assert.equal(JSON.parse(await text('get_theme', { id: 'folio' })).contrast.pass, true);
    const imported = JSON.parse(await text('import_theme', { source: ':root { --background: #ffffff; --foreground: #111111; --primary: #0e7490; }', id: 'teal' }));
    assert.equal(imported.theme.light.accent, '#0e7490');
    assert.match(await text('export_theme', { theme: 'gaudi', format: 'registry' }), /"type": "registry:theme"/);
    const missing = await client.callTool({ name: 'get_component', arguments: { name: 'Buttn' } });
    assert.equal(missing.isError, true);
    assert.match(missing.content[0].text, /Did you mean/);
  } finally {
    await client.close();
  }
});
