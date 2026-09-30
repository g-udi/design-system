/** Copyable source for scalar/JSON playground args. Never serialize React slots. */
export function previewSource(component, args, {imports = '', children, before = '', after = ''} = {}) {
  const attributes = Object.entries(args).filter(([, value]) => value !== undefined && typeof value !== 'function').map(([name, value]) => {
    if (value && typeof value === 'object' && '$$typeof' in value) return null;
    return `  ${name}={${JSON.stringify(value)}}`;
  }).filter(Boolean);
  const opening = `<${component}${attributes.length ? `\n${attributes.join('\n')}\n` : ''}`;
  return `${imports}\n\n${before}${children === undefined ? `${opening}/>` : `${opening}>\n${children}\n</${component}>`}${after}`;
}

/** Dynamic docs source that mirrors the Playground's current args. */
export const playgroundSource = (component, options) => ({
  type: 'dynamic',
  language: 'jsx',
  transform: (_source, { args }) => previewSource(component, args, options)
});
