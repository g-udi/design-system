# ChatContextWindow

Inspect prepared context capacity, highlight categories and request file removal alongside host-owned compaction controls.

## Usage

```jsx
import { ChatContextWindow } from '@gaudi/design-system/chat/ChatContextWindow';

<ChatContextWindow
  usedTokens={1200} maxTokens={8000}
  parts={[{ id: 'instructions', label: 'Instructions', tokens: 1200, color: 'var(--ds-color-chart-1)', detail: 'Prepared system instructions.' }]}
/>
```

## API

| Prop | Contract |
| --- | --- |
| `usedTokens / maxTokens` | Prepared totals. Zero capacity displays 0% and an empty decorative cell map; totals are not inferred from files. |
| `parts` | Ordered { id, label, tokens, color?, detail?, busy?, files?: { id, name, tokens, disabled? }[], actions?: ReactNode }. Color accepts a Gaudi token value. Busy animates only that part, respecting reduced motion. |
| `onRemoveFile` | `(fileId, partId) => void` requests removal. Omit to hide remove controls. Returns focus to that category disclosure; no file is deleted. |
| `disabled` | Disable file removal while retaining category inspection. Host-provided action slots manage their own disabled state. |
| `tone` | Host-supplied capacity tone; the component does not choose thresholds. |
| `formatTokens / formatPercentage` | Format counts and percentages. Percentage formatter returns the number without the percent sign. |
| `hint / footer` | Default category guidance and host-owned status/actions. Hover, focus and persistent category selection are local UI state. |
| `title / description` | Panel heading and supporting text. |
| `className` | Additional root classes. Panels fill available width; the consuming layout chooses any maximum width. |

The 100 cells are a decorative approximation of capacity; the exact accessible counts remain in the category list. File categories disclose their own prepared files. Keyboard focus and pointer hover temporarily highlight a category; toggle activation keeps a selection. File removal returns focus to that category trigger. `ChatContextMeter` remains available from `ChatInput` for the compact composer trigger; pass the same prepared totals to both components.

## Ownership and accessibility

Gaudi owns presentation, responsive layout and local inspection state. The application supplies stable IDs, ordering, labels, tones, values and callbacks. Omit mutation callbacks for display-only use. No services, timers, persistence or domain decisions run inside the component.

The panel fills its container and wraps controls on narrow screens. File lists expand within their category disclosure; the consuming layout owns any height limit or scrolling region. Headings use unique instance IDs; native controls and Gaudi disclosures provide keyboard operation.

## Example

The [copyable demo](stories/fixtures/context-window/prompt-composer-context-window.jsx) retains its local simulation, failure/empty states and reset controls. Its preview URL and Storybook story ID are preserved. It composes the public component instead of containing another implementation.

Interaction inspiration: [AffectUI](https://www.affectui.com/components/context-window). Implemented independently using Gaudi primitives.
