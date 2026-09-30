import publicNames from '../fixtures/reui/public-names.json';

/** Source examples use public owner subpaths, preserving explicit Root aliases. */
export function publicSource(source) {
  return source
    .replace(/Adapted from ReUI \(MIT\)/g, 'MIT-licensed source')
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
    );
}

export function CatalogueFrame({ children, family }) {
  return (
    <div className='ds-catalogue-frame' data-family={family}>
      {children}
    </div>
  );
}
