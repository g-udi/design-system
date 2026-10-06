# Search

> Layout/Search · layout · `@gaudi/design-system/layout/Search`

Controlled article filter with a clear action that returns focus to the search field.

## Import

```js
import Search from '@gaudi/design-system/layout/Search';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `Filter articles` | no | Accessible label and placeholder. |
| `value` | `string` | — | no | Controlled query from the host. |
| `setSearchValue` | `(query: string) => void` | — | no | Notifies the host for typing and clearing. |
| `resultsId` | `string` | — | no | ID referenced by aria-controls. |

## Usage

```jsx
import Search from '@gaudi/design-system/layout/Search';

<>
<Search label='Filter articles' value={query} setSearchValue={setQuery} resultsId='article-results' />
<div id='article-results'>{filteredArticles}</div>
</>
```

## Accessibility

Supply a meaningful label and the result region ID. Filtering belongs to the host; clearing the query preserves keyboard focus.

## Examples

- Search (Storybook `layout-components--article-search`)
