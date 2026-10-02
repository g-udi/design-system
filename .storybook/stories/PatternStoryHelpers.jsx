import publicNames from '../fixtures/patterns/public-names.json';

/** Source examples use public owner subpaths, preserving explicit Root aliases. */
export function publicSource(source) {
  return source
    .replace(
      /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["'];?/g,
      (whole, bindings, specifier) => {
        if (specifier.includes('/icons/RegistryIcon'))
          return "import { RegistryIcon } from '@gaudi/design-system/icons';";
        if (specifier.includes('/hooks/'))
          return `import { ${bindings.trim()} } from '@gaudi/design-system/hooks/${specifier.split('/').at(-1).replace(/\.js$/, '')}';`;
        if (specifier.includes('/utilities/cn'))
          return "import { cn } from '@gaudi/design-system';";
        const start = specifier.indexOf('components/');
        if (start < 0) return whole;
        const file = `src/${specifier.slice(start)}`;
        const names = publicNames[file] || {};
        const [area, owner] = file.replace('src/components/', '').split('/');
        const rewritten = bindings.split(',').map((binding) => {
          const [imported, local = imported] = binding.trim().split(/\s+as\s+/);
          const published = names[imported] || imported;
          return `${published}${published === local ? '' : ` as ${local}`}`;
        });
        return `import { ${rewritten.join(', ')} } from '@gaudi/design-system/${area}/${owner}';`;
      }
    )
    .replace(
      /from ["'][^"']*\/icons\/brands\/([^"']+)\.jsx["']/g,
      "from '@gaudi/design-system/icons/brands/$1'"
    )
    // Lazily loaded owners (charts kept out of the first bundle) keep their dynamic import.
    .replace(
      /import\(\s*["'][^"']*\/components\/([^/"']+)\/([^/"']+)\/index\.js["']\s*\)/g,
      "import('@gaudi/design-system/$1/$2')"
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
 * Turns eagerly globbed `c-<family>-<n>.jsx` fixtures and their raw sources into
 * one-line stories: `export const X = { name: '…', ...pattern(1) }`.
 */
export function patternStories(family, modules, sources) {
  const fixture = (number) => {
    const key = Object.keys(modules).find((path) => path.endsWith(`/c-${family}-${number}.jsx`));
    if (!key) throw new Error(`Missing ${family} fixture ${number}`);
    return key;
  };
  return (number, description) => {
    const key = fixture(number);
    const { Pattern } = modules[key];
    return {
      render: () => <Pattern />,
      parameters: {
        docs: {
          ...(description ? { description: { story: description } } : {}),
          source: { code: publicSource(sources[key]), language: 'jsx' }
        }
      }
    };
  };
}
