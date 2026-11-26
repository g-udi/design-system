import publicNames from '../catalogue/public-names.json';
import { rewritePublicSource } from './publicSource.js';

export const publicSource = (source, origin) => rewritePublicSource(source, origin, publicNames);

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
