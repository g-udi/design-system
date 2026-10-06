# ChatEffortSlider

> Chat/ChatEffortSlider · chat · `@gaudi/design-system/chat/ChatEffortSlider`

How hard the assistant should think, as a stepped slider over named levels.

## Import

```js
import ChatEffortSlider from '@gaudi/design-system/chat/ChatEffortSlider';
// also: import { … } from '@gaudi/design-system/chat';
```

Exports: `ChatEffortSlider`, `chatEffortLevels`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `Effort` | no | Slider name. |
| `defaultValue` | `low \| medium \| high \| max` | `medium` | no | Initial level. |
| `compact` | `boolean` | `false` | no | Drops step labels and the description. |
| `disabled` | `boolean` | `false` | no | Locks the control. |
| `levels` | `Array<{ value, label, description? }>` | `chatEffortLevels` | no | The levels. |
| `value / onValueChange` | `string / (value, level) => void` | — | no | Controlled level. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `defaultValue`: `low`, `medium`, `high`, `max`

## Usage

```jsx
import { ChatEffortSlider } from '@gaudi/design-system/chat';

<ChatEffortSlider value={effort} onValueChange={setEffort} />
```

## Accessibility

The thumb announces the level name through aria-valuetext.

## Examples

- Playground (Storybook `chat-chateffortslider--playground`)
- Custom levels: review depth (Storybook `chat-chateffortslider--review-depth`)

## Related

`core-slider`

## README

How hard the assistant should think: a stepped slider over named levels, built on the core Slider.

### Usage

```jsx
import { ChatEffortSlider } from '@gaudi/design-system/chat';

<ChatEffortSlider value={effort} onValueChange={setEffort} />
```

### API

| Prop / part | Contract |
| --- | --- |
| `levels` | `{ value, label, description? }`; Low, Medium, High and Max by default (`chatEffortLevels`). |
| `value` / `defaultValue` / `onValueChange(value, level)` | The chosen level’s value. |
| `label` | The slider name. |
| `compact` | Drops the step labels and description for a toolbar. |
| `disabled` | Locks the control. |

### Accessibility

The thumb is named and announces the level name ("High effort") through `aria-valuetext`; arrow keys move one level. Step labels are a pointer shortcut only.
