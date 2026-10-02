# ChatEffortSlider

How hard the assistant should think: a stepped slider over named levels, built on the core Slider.

## Usage

```jsx
import { ChatEffortSlider } from '@gaudi/design-system/chat';

<ChatEffortSlider value={effort} onValueChange={setEffort} />
```

## API

| Prop / part | Contract |
| --- | --- |
| `levels` | `{ value, label, description? }`; Low, Medium, High and Max by default (`chatEffortLevels`). |
| `value` / `defaultValue` / `onValueChange(value, level)` | The chosen level’s value. |
| `label` | The slider name. |
| `compact` | Drops the step labels and description for a toolbar. |
| `disabled` | Locks the control. |

## Accessibility

The thumb is named and announces the level name ("High effort") through `aria-valuetext`; arrow keys move one level. Step labels are a pointer shortcut only.
