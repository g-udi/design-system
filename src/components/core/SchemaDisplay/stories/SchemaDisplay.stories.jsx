import { PlaygroundDemo, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { SchemaDisplay } from '../index.js';

const docs = getComponentDocs('Core/SchemaDisplay');

// A blog's comments endpoint: path and query parameters, a request body and a nested response.

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Data Display/SchemaDisplay',
  id: 'core-schemadisplay',
  component: SchemaDisplay,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], path: 'text', defaultExpandDepth: 'number', showJson: 'boolean' }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults },
  parameters: {
    docs: {
      description: { story: 'An API reference card for a blog or an app: the method badge, the path with `{slug}` highlighted, parameters, the request body and the response as an expandable tree with types, formats, enums and required markers. `showJson` adds the raw definition in CodeBlock. In a chat, render it as a tool result (see Cited answer on Chat/ChatSources).' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.method)).toBeVisible();
    const requestHeading = canvas.getByRole('heading', { name: 'Request body' });
    await expect(requestHeading).toBeVisible();
    await expect(getComputedStyle(requestHeading).textTransform).toBe('none');
    // Nested objects open and close from their row.
    const author = canvas.getAllByRole('button', { name: /author/ })[0];
    if (author.getAttribute('aria-expanded') === 'false') await userEvent.click(author);
    await waitFor(() => expect(author).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.click(author);
    await waitFor(() => expect(author).toHaveAttribute('aria-expanded', 'false'));
  }
};
