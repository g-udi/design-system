
export const fileType = (name = '') => String(name).includes('.') ? String(name).split('.').at(-1).toUpperCase() : '';

export const fileIcon = (name = '') => {
  if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name)) return 'FileImage';
  if (/\.(csv|tsv|xlsx?|ods)$/i.test(name)) return 'FileSpreadsheet';
  if (/\.(js|jsx|ts|tsx|json|css|html|py|sh|sql|ya?ml)$/i.test(name)) return 'FileCode';
  return 'FileText';
};

/** Filter file data, not tree interactions: keep matching files and their ancestor folders. */
export function prepareFileTree(source = {}, rootId = 'root', query = '') {
  const items = Object.create(null);
  const counts = Object.create(null);
  const seen = new Set([rootId]);
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const expanded = [];
  let total = 0;

  const visit = (id, matchedParent = false) => {
    const data = source[id];
    if (!data || seen.has(id)) return null;
    seen.add(id);
    const folder = Array.isArray(data.children);
    const text = [data.name, data.typeLabel, data.sizeLabel, data.modifiedLabel, data.meta, data.agent?.name].filter(Boolean).join(' ').toLocaleLowerCase();
    const matches = matchedParent || terms.every((term) => text.includes(term));
    if (!folder) {
      total += 1;
      if (!matches) return null;
      items[id] = data;
      counts[id] = 1;
      return id;
    }
    const children = data.children.map((child) => visit(child, matches)).filter((child) => child !== null);
    if (!matches && !children.length) return null;
    items[id] = { ...data, children };
    counts[id] = children.reduce((sum, child) => sum + counts[child], 0);
    if (children.length) expanded.push(id);
    return id;
  };

  const children = (source[rootId]?.children ?? []).map((id) => visit(id)).filter((id) => id !== null);
  items[rootId] = { ...source[rootId], name: source[rootId]?.name || 'Files', children };
  counts[rootId] = children.reduce((sum, id) => sum + counts[id], 0);
  return { items, counts, expanded, total, hasItems: seen.size > 1, matches: counts[rootId] };
}
