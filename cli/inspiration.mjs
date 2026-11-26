// Publisher calls use public search terms. Gaudi's own MCP stays local.
import { readFileSync } from 'node:fs';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const providers = {
  affectui: { endpoint: 'https://www.affectui.com/api/mcp', catalog: 'https://www.affectui.com/llms.txt' },
  beui: { endpoint: 'https://mcp.beui.dev/mcp', catalog: 'https://beui.dev/r' },
  shoogle: { endpoint: 'https://mcp.shoogle.dev/mcp', catalog: 'https://shoogle.dev/search' },
  reui: { catalog: 'https://reui.io/llms.txt', reason: 'Use a connected ReUI MCP with your account or follow the public component index.' },
  'cult-ui': { catalog: 'https://www.cult-ui.com/llms.txt', reason: 'Use the connected shadcn MCP for the Cult UI registry or open the component index.' },
  'orb-ui': { catalog: 'https://orb-ui.com/docs', reason: 'Open the voice orb API or a matching integration example.' },
  'arc-ui': { catalog: 'https://uiarc.dev/llms.txt', reason: 'Use a connected Arc MCP or the public component Markdown.' },
  'skiper-ui': { catalog: 'https://skiper-ui.com/components', reason: 'Use the Skiper UI registry through a connected shadcn MCP or open the component gallery.' }
};
const { componentCatalogs } = JSON.parse(readFileSync(new URL('../ai/setup.json', import.meta.url), 'utf8'));

function componentData(result) {
  const content = (result.content ?? []).filter((part) => part.type === 'text').map((part) => part.text).join('\n');
  if (result.isError) throw new Error(content || 'The publisher could not return this item.');
  if (result.structuredContent !== undefined) return result.structuredContent;
  if (!content.trim()) throw new Error('The publisher returned no readable component data.');
  try { return JSON.parse(content); } catch { return content; }
}

async function readPublisher(endpoint, tool) {
  const deadline = AbortSignal.timeout(10_000);
  const transport = new StreamableHTTPClientTransport(new URL(endpoint), {
    fetch: (url, options) => fetch(url, {
      ...options, credentials: 'omit', redirect: 'error',
      signal: options.signal ? AbortSignal.any([deadline, options.signal]) : deadline
    })
  });
  const client = new Client({ name: 'gaudi-design-system', version: '1.0.0' });
  try {
    await client.connect(transport, { signal: deadline });
    return componentData(await client.callTool(tool, undefined, { signal: deadline }));
  } finally {
    try {
      if (transport.sessionId && !deadline.aborted) await transport.terminateSession();
    } finally {
      await client.close();
    }
  }
}

/** Resolve one public component query without credentials or configuration changes. */
export async function lookupInspiration(provider, action, query) {
  if (!Object.hasOwn(componentCatalogs, provider)) throw new Error(`Unknown inspiration provider. Choose from ${Object.keys(componentCatalogs).join(', ')}.`);
  if (!['search', 'item'].includes(action) || typeof query !== 'string' || !query.trim()) {
    throw new Error('Usage: gaudi-ds inspiration <provider> search|item <term>');
  }
  query = query.trim();
  const { catalog, endpoint, reason } = providers[provider] ?? {
    catalog: componentCatalogs[provider], reason: 'Open the publisher catalog to find a matching component.'
  };
  const fallback = (detail) => ({ provider, action, source: 'catalog-fallback', catalog, query, reason: detail });
  if (!endpoint) return fallback(reason);
  if (provider === 'shoogle' && action === 'item') return fallback('Open the individual publisher item identified by the Shoogle search result.');

  let tool;
  if (provider === 'shoogle') tool = { name: 'search_registry_items', arguments: { query, limit: 8 } };
  else if (action === 'item') tool = { name: 'get_component', arguments: { slug: query } };
  else tool = { name: 'search_components', arguments: { query } };

  try {
    const data = await readPublisher(endpoint, tool);
    if (action === 'search' && (
      (Array.isArray(data) && data.length === 0) ||
      (Array.isArray(data?.items) && data.items.length === 0) ||
      (typeof data === 'string' && data.startsWith('Nothing matched '))
    )) return fallback('The publisher returned no matching components. Continue in its catalog.');
    return { provider, action, source: 'mcp', data };
  } catch (error) {
    const detail = String(error.message || error).slice(0, 300);
    return fallback(error.code >= 400 && error.code <= 599 ? `HTTP ${error.code}: ${detail}` : detail);
  }
}
