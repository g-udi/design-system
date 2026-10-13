# Post lists

> Blocks/Blog/Post lists · post · `@gaudi/design-system/post/Post`

Blog-post sections using the same Post summaries and article data as the blog pages. Image cards, featured articles, horizontal rows, and compact archives reuse one component.

## Import

```js
import Postlists from '@gaudi/design-system/post/Post';
// also: import { … } from '@gaudi/design-system/post';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `frontMatter` | `Article metadata` | `{}` | no | Title, prepared href, date, subtitle and category { id, label, href }. String categories remain unlinked labels; absent hrefs never create a route. |
| `layout` | `list \| stacked \| horizontal` | `list` | no | Post presentation. Horizontal media stacks in narrow containers. |
| `media` | `ReactNode` | — | no | Optional image or media before the summary. |
| `footer` | `ReactNode` | — | no | Optional byline and reading-time composition. |
| `className` | `string` | — | no | Classes on the list item. |
| `locale` | `string` | — | no | Date formatting locale. |
| `titleVariant` | `string` | `index-list-title` | no | Shared Typography variant; use heading-md for a featured article. |
| `titleAs` | `ElementType` | `h3` | no | Heading element appropriate to the surrounding list. |

## Variants

- `layout`: `list`, `stacked`, `horizontal`

## Usage

```jsx
import { Post } from '@gaudi/design-system';

<ul>
  <Post frontMatter={frontMatter} />
</ul>
```

## Accessibility

Use a meaningful linked title and an appropriate heading level. Content and routing remain application-owned.

## Examples

- Post metadata (Storybook `post-post--playground`)
- Image cards (Storybook `post-post--image-cards`)
- Featured and recent (Storybook `post-post--featured`)
- Horizontal rows (Storybook `post-post--horizontal`)
- Compact list (Storybook `post-post--compact`)

## Related

`mdx-image`

## README

A semantic list entry for the blog. Storybook's **Blocks → Blog → Post lists** shows image cards, featured and recent articles, horizontal rows, and a compact archive using the same component and article data as the blog pages.

```jsx
import Post from '@gaudi/design-system/post/Post';
import { PostReadingTime } from '@gaudi/design-system/post/PostHeader';

<ul>
  <Post
    frontMatter={article}
    layout='stacked'
    media={<img src='/cover.jpg' alt='' />}
    footer={<PostReadingTime readingTime='8 min read' />}
  />
</ul>
```

`frontMatter` contains the supplied `title`, `href`, `date`, `subtitle`, `draft`, and `category` (`{ label, href }` or an unlinked string). `locale` controls date formatting; `titleAs` defaults to `h3`; `titleVariant` defaults to `index-list-title` and accepts a shared Typography variant. Applications prepare routes and content. `Post` does not infer a destination or estimate reading time.

`layout` defaults to `list`, preserving the existing text index. `stacked` puts optional media above the summary. `horizontal` puts media beside the text when the list item is at least 36rem wide and stacks it below that width. `media` and `footer` accept composed content; `className` and standard list-item props pass to the outer `li`.

Place entries inside a list. Use a heading level appropriate to the surrounding section and keep the title link descriptive. Cover artwork that repeats the title's purpose can use empty alt text; meaningful illustrations need a useful description. Keep unrelated buttons and category links outside the title link. Layouts in the examples use shared styles and do not duplicate post metadata rendering.
