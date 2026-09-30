# Tooltip

Short, supplementary hints for named controls. Pass content and a single ref-forwarding trigger. Never put interactive content in a tooltip.

## Usage

```jsx
import Tooltip from '@gaudi/design-system/core/Tooltip';

<Tooltip content='Copy a link to this article'>
  <Button variant='outline' tone='neutral'>
    Copy link
  </Button>
</Tooltip>;
```

## Accessibility

Available on focus and hover, dismisses with Escape. The trigger still needs its own accessible name; use Dialog or Popover for interactive details.

## Examples

ActionHint, KeyboardHint, LongHint in Storybook. All examples support light and dark themes.
