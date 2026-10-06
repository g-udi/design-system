import publicNames from '../catalogue/public-names.json';

function publicImport(specifier, origin) {
  if (!specifier.startsWith('.')) return;
  const path = new URL(specifier, new URL(origin, 'file:///')).pathname;
  const file = decodeURIComponent(path.slice(path.lastIndexOf('/src/') + 1));
  if (file === 'src/icons/RegistryIcon.jsx')
    return { specifier: '@gaudi/design-system/icons' };
  if (file.startsWith('src/icons/brands/'))
    return { specifier: `@gaudi/design-system/${file.slice(4).replace(/\.jsx$/, '')}` };
  if (file === 'src/context/index.js')
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
export function publicSource(source, origin) {
  return source
    .replace(
      /\bimport\s+([\w$*{},\s]+)\s+from\s+["']([^"']+)["'];?/g,
      (whole, bindings, specifier) => {
        const published = publicImport(specifier, origin);
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
        const published = publicImport(specifier, origin);
        return published ? `import('${published.specifier}')` : whole;
      }
    );
}

export function CatalogueFrame({ children, family }) {
  return (
    <div className='ds-catalogue-frame' data-family={family}>
      {children}
    </div>
  );
}

/** Shared meta for a family catalogue; spread it after the literal title and tags. */
export const catalogueMeta = (family) => ({
  decorators: [
    (Story) => (
      <CatalogueFrame family={family}>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: { layout: 'padded' }
});

/**
 * Turns eagerly globbed `<family>-<slug>.jsx` fixtures and their raw sources into
 * one-line stories: `export const X = { name: '…', ...pattern('slug') }`.
 */
export function patternStories(family, storyUrl, modules, sources) {
  const fixture = (slug) => {
    const key = Object.keys(modules).find((path) => path.endsWith(`/${family}-${slug}.jsx`));
    if (!key) throw new Error(`Missing ${family} fixture ${slug}`);
    return key;
  };
  return (slug, description) => {
    const key = fixture(slug);
    const { Pattern } = modules[key];
    return {
      render: () => <Pattern />,
      parameters: {
        docs: {
          ...(description ? { description: { story: description } } : {}),
          source: { code: publicSource(sources[key], new URL(key, storyUrl)), language: 'jsx' }
        }
      }
    };
  };
}
