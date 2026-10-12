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
