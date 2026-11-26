/**
 * Copyable source for scalar/JSON playground args. Never serialize React slots.
 * `attributes` adds raw expression props (`open={open}`) before the args; string
 * `children` args print as JSX children.
 */
export function previewSource(component, args, {imports = '', attributes = [], children, before = '', after = ''} = {}) {
  const { children: childArg, ...props } = args;
  const body = children ?? (typeof childArg === 'string' ? `  ${/[<>{}&]/.test(childArg) ? `{${JSON.stringify(childArg)}}` : childArg}` : undefined);
  const serialized = Object.entries(props).filter(([, value]) => value !== undefined && typeof value !== 'function').map(([name, value]) => {
    if (value && typeof value === 'object' && '$$typeof' in value) return null;
    if (typeof value === 'string' && !/['"\\\n]/.test(value)) return `  ${name}='${value}'`;
    return `  ${name}={${JSON.stringify(value)}}`;
  }).filter(Boolean);
  const lines = [...attributes.map((attribute) => `  ${attribute}`), ...serialized];
  const opening = `<${component}${lines.length ? `\n${lines.join('\n')}\n` : ''}`;
  return `${imports}\n\n${before}${body === undefined ? `${opening}/>` : `${opening}>\n${body}\n</${component}>`}${after}`;
}

/** Authored source mirrors current args without serializing mounted React elements. */
export const playgroundSource = (component, options) => ({
  type: 'code',
  language: 'jsx',
  transform: (_source, { args }) => previewSource(component, args, options)
});

/** Prefer sources defined by the story or its meta, including sources supplied by a factory. */
export function setFallbackSource(story, meta, example) {
  const authored = [story, meta].some(entry => {
    const source = entry.parameters?.docs?.source;
    return source?.code !== undefined || Boolean(source?.transform);
  });
  if (authored) return;
  const editedProps = /(,?\s*)\.\.\.__gaudiEditedProps\b/;
  const source = { language: 'jsx', type: 'code' };
  if (editedProps.test(example)) {
    source.transform = (_original, { args = {}, initialArgs = {} }) => {
      const changes = [];
      for (const [key, value] of Object.entries(args)) {
        if (!Object.hasOwn(initialArgs, key) || value === initialArgs[key]) continue;
        try {
          // Callbacks, React slots and cyclic host objects keep their authored expression.
          const literal = value === undefined ? 'undefined' : JSON.stringify(value, (_key, entry) => {
            if (typeof entry === 'function' || entry?.$$typeof) throw new TypeError('Host value');
            return entry;
          });
          if (literal !== undefined) changes.push(`${JSON.stringify(key)}: ${literal}`);
        } catch { /* Only Docs controls with a portable value override the authored defaults. */ }
      }
      return example.replace(editedProps, (_match, separator) =>
        changes.length ? separator + '...{ ' + changes.join(', ') + ' }' : '');
    };
  } else {
    source.code = example;
  }
  const params = story.parameters;
  story.parameters = { ...params, docs: { ...params?.docs, source } };
}
