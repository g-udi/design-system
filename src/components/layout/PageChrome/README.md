# PageChrome

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
