# SchemaDisplay

An API endpoint or a JSON Schema as a reference card: the method badge, the path with its parameters highlighted, and the parameters, request body and response as an expandable property tree with types, formats, enums, required markers and descriptions.

It lives in Core rather than Chat because API reference is as common in blog posts and app settings as it is in a tool result. In a chat, render it inside a reply or as `MessageTool` output.

## Usage

```jsx
import { SchemaDisplay } from '@gaudi/design-system';

<SchemaDisplay
  method='GET'
  path='/posts/{slug}/comments'
  parameters={[
    { name: 'slug', in: 'path', type: 'string' },
    { name: 'limit', in: 'query', type: 'integer', description: 'At most 50.' }
  ]}
  responseBody={commentsSchema}
  showJson
/>

<SchemaDisplay title='Comment' schema={commentSchema} defaultExpandDepth={2} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `method` / `path` | Endpoint verb (GET, POST, PUT, PATCH, DELETE colour-coded) and path; `{id}` and `:id` are highlighted. |
| `parameters` | `{ name, in, type?, schema?, required?, description? }`; path parameters are always required. |
| `requestBody` / `responseBody` / `schema` | Plain JSON Schema: `type`, `properties`, `required`, `items`, `enum`, `format`, `description`, `oneOf`/`anyOf`. |
| `defaultExpandDepth` | Levels of nested objects that start open (default 1). |
| `showJson` | Adds a Schema / JSON toggle with the raw definition in `CodeBlock`. |
| `headingLevel` | Heading level of the section titles (default 3). |
| `SchemaDisplayMethod`, `SchemaDisplayPath`, `SchemaDisplayProperties` | The badge, the path and the property tree on their own. |

It reads schemas only. Fetching, `$ref` resolution and validation stay in the app.

## Accessibility

Section titles are real headings. Nested objects open from disclosure buttons with `aria-expanded`. "required" is written out rather than shown by colour, and highlighted path parameters keep their braces.

## Attribution

Adapted from the Schema Display component of [AI SDK Elements](https://elements.ai-sdk.dev/components/schema-display) (MIT License, Copyright (c) 2023 Vercel, Inc.).
