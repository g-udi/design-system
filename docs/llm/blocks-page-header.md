# Page Header

> Blocks/Page Header · layout · `@gaudi/design-system/layout/PageHeader`

Page or section introduction: optional eyebrow, a title (h1 by default), description and actions, with optional sticky and divider modes.

## Import

```js
import PageHeader from '@gaudi/design-system/layout/PageHeader';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | no | The heading text. |
| `titleAs` | `ElementType` | `h1` | no | Heading element; use h2 for sections within a page. |
| `titleVariant` | `Typography variant` | `title-md` | no | Typography style of the title, such as display-lg or heading-lg. |
| `titleId` | `string` | — | no | ID for the heading, so a section or list can reference it with aria-labelledby. |
| `eyebrow` | `ReactNode` | — | no | Short label above the title. |
| `description` | `ReactNode` | — | no | Supporting text below the title. |
| `actions` | `ReactNode` | — | no | Controls or meta beside the title, such as a count, filter or button; wraps below on narrow screens. |
| `sticky` | `boolean` | `false` | no | Pin to the top on the page background with a bottom border while the content below scrolls. |
| `divider` | `boolean` | `false` | no | Bottom border separating the header from the content below, without pinning. |
| `children` | `ReactNode` | — | no | Extra content below the description, such as filters. |
| `className` | `string` | — | no | Additional classes on the header element. |
| `classNames` | `{ root, eyebrow, title, description, actions }` | `{}` | no | Slot class overrides. |

## Usage

```jsx
import PageHeader from '@gaudi/design-system/layout/PageHeader';

<PageHeader eyebrow='Archive' title='Projects' description='Things I have built and maintain.' divider />
```

## Accessibility

Renders a header element with one heading at the level you choose; keep a single h1 per page and use titleAs='h2' for section headers. Give a sticky header a titleId and point the region it labels at it with aria-labelledby. Actions keep their own accessible names.

## Examples

- Playground (Storybook `layout-page-header--playground`)
- Sticky list heading (Storybook `layout-page-header--sticky-list-heading`)

## README

The introduction at the top of a page or section: an optional eyebrow, a title, a description and an actions slot. Server-safe, so it renders in server components.

```jsx
import PageHeader from '@gaudi/design-system/layout/PageHeader';

<PageHeader eyebrow='Archive' title='Projects' description='Things I have built and maintain.' divider />

// A list heading that stays visible while the list scrolls.
<section aria-labelledby='all-posts'>
  <PageHeader sticky titleAs='h2' titleVariant='heading-lg' titleId='all-posts' title='All posts' actions={ <span>42 posts</span> } />
  {list}
</section>
```

### Contract

- `title` (ReactNode): the heading text. `titleAs` (default `h1`) sets the element and `titleVariant` (default `title-md`) the Typography style.
- `titleId` (string): an ID on the heading for `aria-labelledby`.
- `eyebrow`, `description` (ReactNode): optional label above and supporting text below the title.
- `actions` (ReactNode): controls or meta beside the title; they wrap below it on narrow screens.
- `divider` (boolean, default `false`): a bottom border in the `border` token.
- `sticky` (boolean, default `false`): `sticky top-0` on the `background` token with the same border, for headers that stay visible while the content below scrolls.
- `children`: extra content below the description, such as filters.
- `className`, `classNames` (`root`, `eyebrow`, `title`, `description`, `actions`): style overrides.

### Accessibility

Keep one `h1` per page and use `titleAs='h2'` for section headers. A sticky header covers content scrolled beneath it, so keep it compact; label the region it introduces with `aria-labelledby` pointing at `titleId`.
