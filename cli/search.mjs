// Scored search over components, hooks and blocks/patterns in the generated metadata.
const tokenize = (value) => String(value || '').toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 1);
const stem = (token) => token.replace(/(?:ies)$/, 'y').replace(/(?:es|s)$/, '');
// Common UI vocabulary that differs from Gaudi owner names.
const SYNONYMS = {
  picker: ['select', 'calendar'], datepicker: ['calendar', 'date'], modal: ['dialog'], popup: ['popover', 'dialog'],
  dropdown: ['menu', 'select'], combobox: ['select', 'autocomplete'], toast: ['notification'], notification: ['toast'],
  snackbar: ['toast'], alert: ['banner', 'dialog'], drawer: ['sheet', 'dialog'], sidebar: ['shell', 'navigation'],
  navbar: ['navigation', 'menu'], header: ['navigation', 'menu'], table: ['datatable', 'data'], grid: ['datatable'],
  tag: ['pill', 'badge'], chip: ['pill', 'badge'], badge: ['pill'], loader: ['loading', 'skeleton'], spinner: ['loader', 'loading'],
  toggle: ['switch'], radio: ['radiogroup'], upload: ['fileupload'], stepper: ['wizard'], onboarding: ['wizard'],
  login: ['auth', 'sign'], signin: ['auth'], signup: ['auth'], kpi: ['stat', 'metric'], graph: ['chart'], tooltip: ['tooltip', 'popover']
};
const expand = (tokens) => [...new Set(tokens.flatMap((token) => [token, ...(SYNONYMS[token] || [])]))];

function scoreText(tokens, text, weight) {
  if (!text) return 0;
  const words = new Set(tokenize(text).map(stem));
  return tokens.reduce((score, token) => score + (words.has(token) ? weight : 0), 0);
}

function scoreComponent(component, query, tokens) {
  const name = component.name.toLowerCase().replace(/\s+/g, '');
  const compact = query.replace(/[^a-z0-9]+/g, '');
  let score = 0;
  if (name === compact || component.id === query) score += 100;
  else if (name.startsWith(compact)) score += 40;
  else if (compact.length > 2 && name.includes(compact)) score += 25;
  score += scoreText(tokens, `${component.name} ${component.title.replace(/\//g, ' ')}`, 12);
  score += scoreText(tokens, (component.import?.exports || []).join(' ').replace(/([a-z])([A-Z])/g, '$1 $2'), 4);
  score += scoreText(tokens, component.summary || component.description, 6);
  score += scoreText(tokens, [component.overview, ...(component.decisionRules || [])].join(' '), 3);
  score += scoreText(tokens, component.props.map((prop) => prop.name).join(' '), 2);
  score += scoreText(tokens, [component.accessibility, ...(component.notes || [])].join(' '), 1);
  score += scoreText(tokens, component.examples.patterns.map((pattern) => pattern.title).join(' '), 2);
  return score;
}

function scoreBlock(block, query, tokens) {
  let score = block.name === query ? 100 : 0;
  score += scoreText(tokens, block.title, 10);
  score += scoreText(tokens, `${block.family} ${block.storyTitle || ''} ${block.owner}`, 6);
  score += scoreText(tokens, block.uses.join(' ').replace(/([a-z])([A-Z])/g, '$1 $2'), 1);
  // Page-level blocks outrank component examples for the same words.
  return score && block.type === 'registry:block' ? score + 2 : score;
}

/** Returns results sorted by score, then name; `category` filters components and block owners. */
export function search(metadata, query, { category, limit = 15, kinds = ['component', 'hook', 'block'] } = {}) {
  const text = String(query || '').toLowerCase().trim();
  const tokens = expand(tokenize(text)).map(stem);
  if (!tokens.length && !text) return [];
  const wanted = category ? String(category).toLowerCase() : null;
  const results = [];
  for (const component of metadata.components) {
    if (!kinds.includes(component.kind) || (wanted && component.category !== wanted)) continue;
    const score = scoreComponent(component, text, tokens);
    if (score > 0) results.push({ kind: component.kind, id: component.id, name: component.name, category: component.category, import: component.import.path, description: component.summary || component.description, score });
  }
  if (kinds.includes('block')) {
    for (const block of metadata.blocks) {
      if (wanted && !(block.owner.startsWith(`${wanted}/`) || block.family === wanted)) continue;
      const score = scoreBlock(block, text, tokens);
      if (score > 0) results.push({ kind: block.type === 'registry:block' ? 'block' : 'pattern', id: block.name, name: block.title, category: block.owner.split('/')[0], import: block.ownerImport, description: block.description, install: block.install.registry, score });
    }
  }
  return results.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit);
}

const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
};

/** Suggestions for a name that matched nothing: search results, else close spellings of owner names. */
export function suggest(metadata, name, limit = 5) {
  const found = search(metadata, name, { limit }).map((result) => result.id);
  if (found.length) return found;
  const key = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '');
  return metadata.components
    .map((component) => ({ id: component.id, score: distance(key, component.name.toLowerCase().replace(/[^a-z0-9]+/g, '')) }))
    .filter((entry) => entry.score <= Math.max(2, Math.floor(key.length / 4)))
    .sort((a, b) => a.score - b.score || a.id.localeCompare(b.id))
    .slice(0, limit)
    .map((entry) => entry.id);
}
