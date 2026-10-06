import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const bin = fileURLToPath(new URL('../../bin/gaudi-ds.mjs', import.meta.url));

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
    assert.match(await text('get_install_command', { name: 'screens-account-settings' }), /shadcn@latest add @gaudi\/screens-account-settings/);
    assert.match(await text('get_install_command', { name: 'Button' }), /import Button from '@gaudi\/design-system\/core\/Button'/);
    assert.equal(JSON.parse(await text('validate_usage', { code: "import { Nope } from '@gaudi/design-system';" })).valid, false);
    assert.match(await text('get_agent_skill'), /name: gaudi-design-system/);
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
