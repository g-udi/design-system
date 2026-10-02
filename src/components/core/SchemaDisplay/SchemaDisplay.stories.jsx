import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { SchemaDisplay } from './index.js';

const docs = getComponentDocs('Core/SchemaDisplay');

// A blog's comments endpoint: path and query parameters, a request body and a nested response.
const comment = {
  type: 'object',
  required: ['id', 'body', 'author'],
  properties: {
    id: { type: 'string', format: 'uuid', description: 'Stable comment id.' },
    body: { type: 'string', description: 'Markdown body, at most 2,000 characters.' },
    status: { type: 'string', enum: ['published', 'pending', 'hidden'], description: 'Moderation state.' },
    author: {
      type: 'object',
      required: ['name'],
      description: 'Who wrote it.',
      properties: {
        name: { type: 'string' },
        url: { type: 'string', format: 'uri', description: 'Optional homepage.' }
      }
    }
  }
};

const commentsEndpoint = {
  method: 'POST',
  path: '/posts/{slug}/comments',
  description: 'Adds a comment to a published post. Comments from new readers wait for moderation.',
  parameters: [
    { name: 'slug', in: 'path', type: 'string', description: 'The post slug, as in the URL.' },
    { name: 'notify', in: 'query', type: 'boolean', description: 'Email the author when the comment is published.' }
  ],
  requestBody: {
    type: 'object',
    required: ['body', 'author'],
    properties: {
      body: comment.properties.body,
      author: comment.properties.author,
      replyTo: { type: 'string', format: 'uuid', description: 'The comment this replies to.' }
    }
  },
  responseBody: {
    type: 'object',
    required: ['comment'],
    properties: {
      comment,
      thread: { type: 'array', items: comment, description: 'The thread the comment joined, oldest first.' }
    }
  }
};

export default {
  title: 'Core/Data Display/SchemaDisplay',
  id: 'core-schemadisplay',
  component: SchemaDisplay,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], path: 'text', defaultExpandDepth: 'number', showJson: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { method: 'POST', path: '/posts/{slug}/comments', defaultExpandDepth: 1, showJson: true },
  parameters: {
    docs: {
      description: { story: 'An API reference card for a blog or an app: the method badge, the path with `{slug}` highlighted, parameters, the request body and the response as an expandable tree with types, formats, enums and required markers. `showJson` adds the raw definition in CodeBlock. In a chat, render it as a tool result (see Cited answer on Chat/ChatSources).' },
      source: {
        language: 'jsx',
        code: `import { SchemaDisplay } from '@gaudi/design-system';

<SchemaDisplay
  method='POST'
  path='/posts/{slug}/comments'
  description='Adds a comment to a published post.'
  parameters={[
    { name: 'slug', in: 'path', type: 'string', description: 'The post slug, as in the URL.' },
    { name: 'notify', in: 'query', type: 'boolean' }
  ]}
  requestBody={requestSchema}
  responseBody={responseSchema}
  showJson
/>`
      }
    }
  },
  render: ({ method, path, defaultExpandDepth, showJson }) => (
    <div className='w-full max-w-2xl'>
      <SchemaDisplay key={`${defaultExpandDepth}`} {...commentsEndpoint} method={method} path={path} defaultExpandDepth={defaultExpandDepth} showJson={showJson} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.method)).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Request body' })).toBeVisible();
    // Nested objects open and close from their row.
    const author = canvas.getAllByRole('button', { name: /author/ })[0];
    if (author.getAttribute('aria-expanded') === 'false') await userEvent.click(author);
    await waitFor(() => expect(author).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.click(author);
    await waitFor(() => expect(author).toHaveAttribute('aria-expanded', 'false'));
  }
};
