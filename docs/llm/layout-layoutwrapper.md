# LayoutWrapper

> Layout/LayoutWrapper · layout · `@gaudi/design-system/layout/LayoutWrapper`

Client-safe page shell composed from navigation, one main landmark, and Footer.

## Import

```js
import LayoutWrapper from '@gaudi/design-system/layout/LayoutWrapper';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Page content placed in main. |
| `footerProps` | `Footer props` | — | no | Host-owned footer content and newsletter configuration. |

## Usage

```jsx
import LayoutWrapper from '@gaudi/design-system/layout/LayoutWrapper';

<LayoutWrapper footerProps={footerProps}>
  <h1>Latest articles</h1>
  {postList}
</LayoutWrapper>
```

## Accessibility

Provides a single main landmark. Do not nest this shell inside another main element or use it alongside LayoutContainer.

## Examples

- LayoutWrapper (Storybook `layout-components--page-shell`)
- Main Page (Storybook `layout-examples--main-page`)
- Blog Main Page (Storybook `layout-examples--blog-main-page`)
- Category Page With Posts And Pagination (Storybook `layout-examples--category-page-with-posts-and-pagination`)
- Categories Page (Storybook `layout-examples--categories-page`)
- Tags Page (Storybook `layout-examples--tags-page`)
- Projects Page (Storybook `layout-examples--projects-page`)
- Publications Page (Storybook `layout-examples--publications-page`)
- About Me Page (Storybook `layout-examples--about-me-page`)

## Related

`layout-footer`, `layout-layoutcontainer`
