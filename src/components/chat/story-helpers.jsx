import { createComponentDocsPage, getComponentDocs } from '../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../.storybook/stories/docsContract';
import { ExampleFrame } from '../../../.storybook/stories/ApplicationStoryHelpers';

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
  sarah: { name: 'Sarah Chen', src: 'https://randomuser.me/api/portraits/women/44.jpg' },
  omar: { name: 'Omar Haddad', src: 'https://randomuser.me/api/portraits/men/32.jpg' }
};
