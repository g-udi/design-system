const categories = new Set(['Core', 'Blocks', 'Chat', 'Charts', 'Hooks', 'MDX']);

export function catalogueFromIndex(index) {
  const owners = new Map();
  for (const entry of Object.values(index.entries || {})) {
    const [category, ...parts] = entry.title.split('/');
    if (!categories.has(category) || !parts.length || !['story', 'docs'].includes(entry.type)) continue;
    const key = entry.title;
    if (!owners.has(key)) owners.set(key, { key, category, group: parts.slice(0, -1).join(' / '), name: parts.at(-1), docs: null, examples: [] });
    const owner = owners.get(key);
    if (entry.type === 'docs') owner.docs = entry.id;
    else owner.examples.push({ id: entry.id, name: entry.name });
  }
  return [...owners.values()].map(owner => ({ ...owner, examples: owner.examples.sort((a,b)=>a.name.localeCompare(b.name, undefined, {numeric:true})) })).sort((a,b)=>a.name.localeCompare(b.name, undefined, {numeric:true}));
}

export function filterCatalogue(owners, { query = '', category = 'all', owner = '' } = {}) {
  const term = query.trim().toLowerCase();
  return owners.flatMap(item => {
    if ((category !== 'all' && item.category !== category) || (owner && item.key !== owner)) return [];
    const ownerMatches = `${item.name} ${item.group} ${item.category}`.toLowerCase().includes(term);
    const examples = ownerMatches ? item.examples : item.examples.filter(example => example.name.toLowerCase().includes(term));
    return ownerMatches || examples.length ? [{...item, examples}] : [];
  });
}
