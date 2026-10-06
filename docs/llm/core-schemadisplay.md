# SchemaDisplay

> Core/SchemaDisplay · core · `@gaudi/design-system/core/SchemaDisplay`

Read an API endpoint or a JSON Schema: method badge, path with highlighted parameters, and request and response schemas as an expandable property tree.

## Import

```js
import SchemaDisplay from '@gaudi/design-system/core/SchemaDisplay';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `SchemaDisplay`, `SchemaDisplayMethod`, `SchemaDisplayPath`, `SchemaDisplayProperties`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `method / path` | `string / string` | — | no | Endpoint verb and path; {id} and :id parameters are highlighted. |
| `title / description` | `ReactNode` | — | no | A name for a bare schema and a summary line. |
| `parameters` | `Array<{ name, in, type?, schema?, required?, description? }>` | `[]` | yes | Path, query and header parameters; path parameters are always required. |
| `requestBody / responseBody / schema` | `JSONSchema` | — | yes | Schemas read as trees: type, format, required, description, enum, items and oneOf. |
| `defaultExpandDepth` | `number` | `1` | no | Levels of nested objects that start open. |
| `showJson` | `boolean` | `false` | no | Adds a Schema / JSON toggle with the raw definition in CodeBlock. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | no | Heading level of the section titles. |
| `labels` | `object` | `English copy` | yes | Section titles and the required marker. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `headingLevel`: `2`, `3`, `4`, `5`, `6`

## Usage

```jsx
import { SchemaDisplay } from '@gaudi/design-system';

<SchemaDisplay
  method='GET'
  path='/posts/{slug}/comments'
  parameters={[{ name: 'slug', in: 'path', type: 'string' }, { name: 'limit', in: 'query', type: 'integer' }]}
  responseBody={commentsSchema}
/>
```

## Accessibility

Sections are real headings at headingLevel. Nested objects are disclosure buttons with aria-expanded; required is written out, never colour alone, and parameter highlights keep their braces.

## Examples

- Playground (Storybook `core-schemadisplay--playground`)

## Related

`core-codeblock`

## README

An API endpoint or a JSON Schema as a reference card: the method badge, the path with its parameters highlighted, and the parameters, request body and response as an expandable property tree with types, formats, enums, required markers and descriptions.

It lives in Core rather than Chat because API reference is as common in blog posts and app settings as it is in a tool result. In a chat, render it inside a reply or as `ChatMessageTool` output.

### Usage

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

### API

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

### Accessibility

Section titles are real headings. Nested objects open from disclosure buttons with `aria-expanded`. "required" is written out rather than shown by colour, and highlighted path parameters keep their braces.
