# ArticleContentLayout

> Layout/ArticleContentLayout · layout · `@gaudi/design-system/layout/ArticleContentLayout`

Responsive article prose with an optional contents rail and controlled or uncontrolled aside visibility. The Blog article example composes a full reading page with journal navigation, smooth scrolling, reading progress, section navigation, expandable images, and video. Use its ScrollArea viewport as the main blog content host during migration and share that ref with ReadingIndicator and Scrollspy.

## Import

```js
import ArticleContentLayout from '@gaudi/design-system/layout/ArticleContentLayout';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children / aside` | `ReactNode` | — | no | Article body and supporting contents or metadata. |
| `hasAside` | `boolean` | `Boolean(aside)` | no | Reserve the supporting column. |
| `collapsibleAside` | `boolean` | `false` | no | Enable the aside disclosure. |
| `asideOpen / defaultAsideOpen` | `boolean` | `— / true` | no | Controlled or initial aside visibility. |
| `onAsideOpenChange` | `(open: boolean) => void` | — | no | Host notification when visibility changes. |
| `showAsideToggleControl` | `boolean` | `true` | no | Built-in toggle and its accessible name suffix. |
| `asideToggleLabel` | `string` | `Table of contents` | no | Built-in toggle and its accessible name suffix. |
| `padding` | `md \| lg` | `md` | no | Vertical prose spacing. |
| `className / contentClassName` | `string` | — | no | Root and article prose classes. |

## Variants

- `padding`: `md`, `lg`

## Usage

```jsx
import ArticleContentLayout from '@gaudi/design-system/layout/ArticleContentLayout';

<ArticleContentLayout aside={tableOfContents} collapsibleAside>
  <h1>{article.title}</h1>
  {articleContent}
</ArticleContentLayout>
```

## Accessibility

The aside toggle is a named button with aria-expanded. Supply a labelled nav or aside and keep heading order in the article body. The Blog article demo's optional Blur edges treatment is decorative, does not intercept input, and clears for keyboard focus, reduced motion, and forced colors. Its scroll destinations and sticky contents remain outside the blur bands.

## Examples

- ArticleContentLayout (Storybook `layout-components--article-content`)
- Blog article (Storybook `layout-article-content-layout--blog-article`)

## Related

`core-scrollarea`, `core-readingindicator`, `core-scrollspy`
