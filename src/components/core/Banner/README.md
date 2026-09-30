# Banner

A banner is a full-width strip for a site-wide message: a release, maintenance, or a billing problem. For a message inside the page, next to the content it is about, compose `Alert`.

```jsx
import { Banner } from '@gaudi/design-system';

<Banner title='Gaudi 2.0 is out' href='/changelog' tone='accent' variant='solid'>
  New tokens and a faster docs site.
</Banner>
```

- `tone` carries meaning (`neutral`, `accent`, `info`, `success`, `warning`, `danger`, `attention`, `discovery`); older hue names still work.
- `variant`: `solid` for the one announcement that matters most, `soft` or `outline` for routine notices. `size` sets the padding.
- With `href` the whole message is one link; without it the banner is announced as a status.

## Alert

`Alert`, `AlertTitle`, `AlertDescription` and `AlertAction` build an inline message with an icon, text and actions. `variant` is `default`, `info`, `success`, `warning`, `destructive` or `invert`. `AlertRoot` and the `*Primitive` names are aliases of the same parts.
