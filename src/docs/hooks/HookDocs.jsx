import { createComponentDocsPage, getComponentDocs } from '../components/ComponentDocs';
import { ExampleFrame } from '../components/ApplicationStoryHelpers';
import { getHook, hookTitle } from './catalogue.js';

/**
 * Shared meta for a Hooks/<Group>/<hook> page; spread it after the literal title, id and tags so the
 * Storybook indexer still reads them. The docs page shows the first story as the live preview,
 * then usage, accessibility, API notes, the API table (parameters, then returns) and every example.
 */
export function hookMeta(name) {
  const hook = getHook(name);
  const docs = getComponentDocs(hookTitle(hook));
  return {
    parameters: {
      controls: { disable: true },
      docs: {
        description: { component: docs.description },
        page: createComponentDocsPage(docs)
      }
    },
    decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
  };
}

/** Story parameters: a description and the copyable source shown under the example. */
export const example = (description, code) => ({
  docs: {
    description: { story: description },
    source: { language: 'jsx', code: code.trim() }
  }
});
