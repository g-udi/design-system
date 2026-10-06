import { SchemaDisplay } from '@gaudi/design-system/core/SchemaDisplay';

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

export const exampleDefaults = { method: 'POST', path: '/posts/{slug}/comments', defaultExpandDepth: 1, showJson: true };

export function PlaygroundDemo(props) {
  const { method, path, defaultExpandDepth, showJson } = { ...exampleDefaults, ...props };
  return <div className='w-full max-w-2xl'>
      <SchemaDisplay key={`${defaultExpandDepth}`} {...commentsEndpoint} method={method} path={path} defaultExpandDepth={defaultExpandDepth} showJson={showJson} />
    </div>;
}
