/**
 * Normalise nodes and links: links may name their ends (`'Search'`) or use node indexes; nodes
 * named only in links are added.
 */
export function sankeyGraph({ links = [], nodes = [] }) {
  const list = nodes.map((node) => (typeof node === 'string' ? { 'name': node } : { ...node }));
  const indexOf = new Map(list.map((node, index) => [ node.name, index ]));
  const resolve = (end) => {
    if (typeof end === 'number') return end;
    if (!indexOf.has(end)) {
      indexOf.set(end, list.length);
      list.push({ 'name': end });
    }

    return indexOf.get(end);
  };
  const resolved = links.map((link) => ({ ...link, 'source': resolve(link.source), 'target': resolve(link.target) }));

  return { 'links': resolved, 'nodes': list };
}
