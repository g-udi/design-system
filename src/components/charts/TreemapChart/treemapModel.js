/** Flatten a one- or two-level tree into indexed leaves, keeping each leaf's group. */
export function treemapLeaves(data, { nameKey = 'name', valueKey = 'value' } = {}) {
  const leaves = [];
  const tree = data.map((record, groupIndex) => {
    const item = record && typeof record === 'object' ? record : { [valueKey]: Number.NaN };
    if (Array.isArray(item.children)) {
      return {
        ...item,
        'children': item.children.map((child) => {
          const leaf = { ...(child && typeof child === 'object' ? child : { [valueKey]: Number.NaN }), '__chartIndex': leaves.length, '__group': item[nameKey], '__groupIndex': groupIndex };
          leaves.push(leaf);

          return leaf;
        })
      };
    }
    const leaf = { ...item, '__chartIndex': leaves.length, '__group': null, '__groupIndex': groupIndex };
    leaves.push(leaf);

    return leaf;
  });

  return { 'leaves': leaves.map((leaf) => ({ ...leaf, 'value': leaf[valueKey] })), tree };
}
