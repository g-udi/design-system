# Card

A bordered surface that frames one unit of content: an article teaser, a metric, a settings group. Use it when content needs a visible boundary; use spacing or a list instead for page structure.

```jsx
import { Card } from '@gaudi/design-system';

<Card title='Weekly readers' subtitle='Last 7 days' variant='outline' padding='sm'>
  <p>12.4k</p>
</Card>
```

- `variant`: `elevated` (default), `outline`, `soft`, or `flat`. `padding`: `none`, `sm`, `md` (default), `lg`. `radius`: `none`, `sm`, `md`, `lg`.
- `title`, `subtitle`, and `titleLevel` (2-6, default 3) render the heading and description with the `CardTitle` and `CardDescription` parts.
- `interactive` adds hover elevation. Keep real links and buttons inside the card rather than making the whole surface clickable.

## Parts

For headers with actions or a footer, compose `CardRoot`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, and `CardFooter`. `CardTitle` and `CardDescription` accept `as` to render a heading or paragraph.

`Frame`, `FramePanel`, `FrameHeader`, `FrameTitle`, `FrameDescription`, and `FrameFooter` build a tinted tray that holds one or more panels, such as stacked settings sections.
