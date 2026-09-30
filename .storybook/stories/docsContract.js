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
 * Playground argTypes described by the authored props reference.
 * `controls` maps a prop to a control type, or to an options array for a select.
 */
export function docsArgTypes(docs, controls) {
  return Object.fromEntries(Object.entries(controls).map(([name, control]) => {
    const [, summary, defaultValue, description] = docs.props.find(([prop]) => prop === name) || [];
    const [type, options] = Array.isArray(control) ? ['select', control] : [control];
    return [name, {
      control: type,
      description,
      ...(options ? { options } : {}),
      table: { type: { summary }, defaultValue: { summary: defaultValue } }
    }];
  }));
}
