function publicImport(specifier, origin, publicNames) {
  if (!specifier.startsWith('.')) return;
  const path = new URL(specifier, new URL(origin, 'file:///')).pathname;
  const file = decodeURIComponent(path.slice(path.lastIndexOf('/src/') + 1));
  if (/^src\/icons(?:\/index(?:\.jsx?)?|\/RegistryIcon(?:\.jsx)?)?\/?$/.test(file))
    return { specifier: '@gaudi/design-system/icons' };
  if (file.startsWith('src/icons/brands/'))
    return { specifier: `@gaudi/design-system/${file.slice(4).replace(/\.jsx$/, '')}` };
  if (/^src\/context(?:\/index(?:\.js)?)?\/?$/.test(file))
    return { specifier: '@gaudi/design-system/context' };
  if (file.startsWith('src/hooks/'))
    return { specifier: '@gaudi/design-system/hooks' };
  if (file.startsWith('src/utilities/cn/'))
    return { specifier: '@gaudi/design-system/utilities/cn' };
  const category = file.match(/^src\/components\/([^/]+)\/index\.js$/);
  if (category) return { specifier: `@gaudi/design-system/${category[1]}` };
  const owner = file.match(/^src\/components\/([^/]+)\/([^/]+)(?:\/|$)/);
  if (owner && !file.includes('/stories/'))
    return {
      specifier: `@gaudi/design-system/${owner[1]}/${owner[2]}`,
      names: publicNames[file]
    };
}

/** Source examples use public owner subpaths, preserving explicit Root aliases. */
export function rewritePublicSource(source, origin, publicNames) {
  return source
    .replace(
      /\bimport\s+([\w$*{},\s]+)\s+from\s+["']([^"']+)["'];?/g,
      (whole, bindings, specifier) => {
        const published = publicImport(specifier, origin, publicNames);
        if (!published) return whole;
        const rewritten = bindings.trim().replace(/\{([^}]+)\}/, (_, named) => {
          const names = named.split(',').filter((binding) => binding.trim()).map((binding) => {
            const [imported, local = imported] = binding.trim().split(/\s+as\s+/);
            const exported = published.names?.[imported] || imported;
            return `${exported}${exported === local ? '' : ` as ${local}`}`;
          });
          return `{ ${names.join(', ')} }`;
        });
        return `import ${rewritten} from '${published.specifier}';`;
      }
    )
    // Lazily loaded owners (charts kept out of the first bundle) keep their dynamic import.
    .replace(
      /\bimport\(\s*["']([^"']+)["']\s*\)/g,
      (whole, specifier) => {
        const published = publicImport(specifier, origin, publicNames);
        return published ? `import('${published.specifier}')` : whole;
      }
    );
}
