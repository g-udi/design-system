# Tooltip

Short, supplementary hints for named controls. Pass content and a single ref-forwarding trigger. Keep it to short text; use a Popover when the content needs a link or a button.

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

Opens on focus and hover and closes with Escape. The trigger still needs its own accessible name; use Dialog or Popover for interactive details.

## Composition

`TooltipProvider`, `TooltipRoot`, `TooltipTrigger` and `TooltipContent` build custom tooltips; the `Tooltip` component is those parts with one trigger and one hint. Mount one `TooltipProvider` around a toolbar so moving between buttons skips the delay.
