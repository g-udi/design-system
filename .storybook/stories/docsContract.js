/** Only expose controls for stories whose render actually accepts args. */
export function acceptsPreviewArgs(story) {
  return Boolean(story?.originalStoryFn?.length) && !story.parameters.controls?.disable;
}

export function selectPreviewStory(stories) {
  const candidates = stories.filter(story => story.tags?.includes('autodocs') && !story.usesMount);
  const rank = story => {
    const name = story.name.toLowerCase();
    return (acceptsPreviewArgs(story) ? 100 : 0)
      + (name === 'playground' ? 40 : /^(default|primary|basic|initials|email)$/.test(name) ? 30 : 0)
      + (!story.exportName?.startsWith('Reui') ? 10 : 0);
  };
  return candidates.reduce((best, story) => !best || rank(story) > rank(best) ? story : best, undefined);
}

export function referenceFromArgTypes(argTypes = {}) {
  return Object.entries(argTypes).flatMap(([name, arg]) => {
    const summary = arg.table?.type?.summary || arg.options?.join(' | ') || arg.type?.name;
    if (arg.table?.disable || !summary || summary === 'unknown' || !arg.description) return [];
    return [[name, summary, arg.table?.defaultValue?.summary ?? '—', arg.description]];
  });
}

export function scalarDefault(summary) {
  if (typeof summary === 'boolean' || typeof summary === 'number') return summary;
  if (summary === 'true') return true;
  if (summary === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(summary || '')) return Number(summary);
  if (/^(['"]).*\1$/.test(summary || '')) return summary.slice(1, -1);
  return undefined;
}

export function previewArgTypes(story, include) {
  return Object.fromEntries(Object.entries(story.argTypes || {}).flatMap(([name, arg]) => {
    if (!arg.control || arg.control.disable || arg.table?.disable || arg.table?.readonly || (include && !include.includes(name))) return [];
    const control = typeof arg.control === 'string' ? {type: arg.control} : arg.control;
    if (control.type === 'object') {
      const initial = story.initialArgs[name] ?? scalarDefault(arg.table?.defaultValue?.summary);
      const inferred = {boolean: 'boolean', string: 'text', number: 'number'}[typeof initial];
      if (inferred) return [[name, {...arg, control: {type: inferred}}]];
      // A React slot or callback is not an editable JSON value.
      if (arg.type?.name === 'unknown' && !arg.description) return [];
    }
    return [[name, arg]];
  }));
}

export function displayedPreviewArgs(rows, args) {
  return Object.fromEntries(Object.keys(rows).map(name => [name,
    args[name] === undefined ? scalarDefault(rows[name].table?.defaultValue?.summary) : args[name]
  ]));
}

/**
 * Resolves one prop from the props reference. Grouped rows such as `min / max / step`
 * share a description; type and default segments are picked when they line up.
 */
export function findPropRow(rows = [], name) {
  for (const [names, type, value, description] of rows) {
    const parts = names.split(' / ').map((part) => part.replace(/^\w+\./, ''));
    const index = parts.indexOf(name);
    if (index < 0) continue;
    const pick = (text) => {
      const segments = String(text).split(' / ');
      return segments.length === parts.length ? segments[index] : text;
    };
    return [name, pick(type), pick(value), description];
  }
}

const controlTypes = { boolean: 'boolean', number: 'number', range: 'number', text: 'string', color: 'string', date: 'number', object: 'object' };

/**
 * Playground argTypes described by the authored props reference.
 * `controls` maps a prop to a control type, or to an options array for a select.
 */
export function docsArgTypes(docs, controls) {
  return Object.fromEntries(Object.entries(controls).map(([name, control]) => {
    const [, summary, defaultValue, description] = findPropRow(docs.props, name) || [];
    const [type, options] = Array.isArray(control) ? ['select', control] : [control];
    return [name, {
      control: name === 'radius' ? false : type,
      // A declared type lets Storybook accept the value from story URLs and args parsing.
      type: options ? { name: 'enum', value: options } : { name: controlTypes[type] || 'other' },
      description,
      ...(options ? { options } : {}),
      table: { type: { summary }, defaultValue: { summary: defaultValue } }
    }];
  }));
}
