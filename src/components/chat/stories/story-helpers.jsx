import { createComponentDocsPage, getComponentDocs } from '../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../docs/components/docsContract';
import { ExampleFrame } from '../../../docs/components/ApplicationStoryHelpers';

/**
 * Shared meta for a Chat owner page; spread it after the literal title, id and tags so the
 * Storybook indexer still reads them. `primary` returns the Playground story.
 */
export function chatMeta(owner, { component, controls = {}, primary, wide = false }) {
  const docs = getComponentDocs(`Chat/${owner}`);
  return {
    component,
    argTypes: docsArgTypes(docs, controls),
    parameters: {
      docs: {
        description: { component: docs.description },
        page: createComponentDocsPage(docs, { primaryStory: primary })
      }
    },
    decorators: [(Story) => <ExampleFrame wide={wide}><Story /></ExampleFrame>]
  };
}

export const gaudiAgent = { name: 'Gaudi', role: 'Writing assistant' };
export const people = {
  sarah: { name: 'Sabine Okafor', src: '/avatars/person-20.svg' },
  omar: { name: 'Kerem Haddadin', src: '/avatars/person-41.svg' }
};
