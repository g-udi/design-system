# Page Chrome

> Blocks/Page Chrome · layout · `@gaudi/design-system/layout/PageChrome`

Per-page switches for LayoutContainer's site chrome: render it in a page to hide the layout background or the page scroll edges while that page is shown.

## Import

```js
import PageChrome from '@gaudi/design-system/layout/PageChrome';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `background` | `boolean` | `true` | no | Show LayoutContainer's background on this page: the background slot, or the default Borealis. false hides it. |
| `scrollEdges` | `boolean` | `true` | no | Show the page-level ScrollEdges (those without a targetRef). false hides them; scroll areas keep theirs. |

## Usage

```jsx
import PageChrome from '@gaudi/design-system/layout/PageChrome';

// app/about/page.js: the page draws its own header background.
export default function AboutPage() {
  return (
    <>
      <PageChrome background={ false } />
      <AboutHeader />
    </>
  );
}
```

## Accessibility

Renders only a hidden, aria-hidden marker and affects decorative layers only: the background and scroll edges are aria-hidden, so no content, landmark or focus order changes.

## Examples

- Playground (Storybook `layout-page-chrome--playground`)

## Related

`layout-layoutcontainer`

## README

Turns off parts of [LayoutContainer](../LayoutContainer/LayoutContainer.js)'s site chrome for the page that renders it.

```jsx
import PageChrome from '@gaudi/design-system/layout/PageChrome';

// An About page with its own header background.
<PageChrome background={ false } />

// An article that reads sharp to the bottom of the window.
<PageChrome scrollEdges={ false } />
```

- `background` (boolean, default `true`): `false` hides the layout background: the `background` slot, or the default Borealis. Backgrounds the page renders itself are unaffected.
- `scrollEdges` (boolean, default `true`): `false` hides the page-level [ScrollEdges](../../core/ScrollArea/README.md) (those without a `targetRef`); scroll areas keep their own edges.

PageChrome renders a hidden marker that `PageChrome.css` (part of `@gaudi/design-system/styles.css`) matches with `:has()`. It needs no client JavaScript, works in server components, and the server HTML is already correct, so the chrome never flashes in. Unmounting the marker, for example on client navigation to another page, restores the chrome.
