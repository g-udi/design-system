# PageHeader

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

## Contract

- `title` (ReactNode): the heading text. `titleAs` (default `h1`) sets the element and `titleVariant` (default `title-md`) the Typography style.
- `titleId` (string): an ID on the heading for `aria-labelledby`.
- `eyebrow`, `description` (ReactNode): optional label above and supporting text below the title.
- `actions` (ReactNode): controls or meta beside the title; they wrap below it on narrow screens.
- `divider` (boolean, default `false`): a bottom border in the `border` token.
- `sticky` (boolean, default `false`): `sticky top-0` on the `background` token with the same border, for headers that stay visible while the content below scrolls.
- `children`: extra content below the description, such as filters.
- `className`, `classNames` (`root`, `eyebrow`, `title`, `description`, `actions`): style overrides.

## Accessibility

Keep one `h1` per page and use `titleAs='h2'` for section headers. A sticky header covers content scrolled beneath it, so keep it compact; label the region it introduces with `aria-labelledby` pointing at `titleId`.
