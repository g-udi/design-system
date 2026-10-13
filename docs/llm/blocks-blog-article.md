# Article

> Blocks/Blog/Article · layout · `@gaudi/design-system/layout/ArticleContentLayout`

A complete blog article with Gaudi journal navigation, PostHeader metadata, reading progress, TableOfContents section navigation, expandable images, a gallery, and captioned video. The main Blog article is joined by a centered Focused essay, a Technical tutorial with nested navigation and code, a wider Photo essay with a gallery, and a Series article with PostSeriesBox navigation across three parts. Each workflow reuses the same scroll boundary, header, media controls, and layout component. Contents-enabled examples use the shared TableOfContents block for links, active sections, and nested branch controls.

## Import

```js
import Article from '@gaudi/design-system/layout/ArticleContentLayout';
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
import TableOfContents from '@gaudi/design-system/post/TableOfContents';
import PostHeader from '@gaudi/design-system/post/PostHeader';

<ArticleContentLayout aside={<TableOfContents toc={toc} contentRef={articleRef} targetRef={readingViewportRef} />} collapsibleAside>
  <PostHeader frontMatter={article} titleVariant='title-md' subtitleVariant='paragraph-md' />
  {articleContent}
</ArticleContentLayout>
```

## Accessibility

The aside toggle is a named button with aria-expanded. Supply a labelled nav or aside and keep heading order in the article body. The Blog article demo's optional Blur edges treatment is decorative, does not intercept input, and clears for keyboard focus, reduced motion, and forced colors. Its scroll destinations and sticky contents remain outside the blur bands.

## Notes

- Article is the Storybook composition name. The supported layout component remains ArticleContentLayout, with its public import and props unchanged.
- The Blog article preview's contents control selects visible, none, collapsible, or collapsed navigation. Its smooth control changes wheel scrolling; keyboard, touch, and reduced-motion reading remain native. The other stories demonstrate distinct reading workflows; table-of-contents visibility remains a control in the main Blog article example.

## Examples

- Blog article (Storybook `layout-article-content-layout--blog-article`)
- Series article (Storybook `layout-article-content-layout--series-article`)
- Focused essay (Storybook `layout-article-content-layout--focused-essay`)
- Technical tutorial (Storybook `layout-article-content-layout--technical-tutorial`)
- Photo essay (Storybook `layout-article-content-layout--photo-essay`)

## Related

`blocks-blog-postheader`, `blocks-blog-tableofcontents`, `blocks-blog-postseriesbox`
