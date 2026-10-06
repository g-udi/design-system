# useSliderInput

> Hooks/State/useSliderInput · hooks · `@gaudi/design-system/hooks`

For a two-thumb range with min and max inputs: slider moves update the inputs, and typed values are clamped against the bounds and the other thumb when committed.

## Import

```js
import { useSliderInput } from '@gaudi/design-system/hooks';
```

Exports: `useSliderInput`

## Parameters

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options.minValue / maxValue / initialValue` | `number / number / [number, number]` | — | no | Bounds and the starting range. |

## Returns

| Name | Type | Description |
| --- | --- | --- |
| `sliderValues / inputValues` | `[number, number] / [number \| "", number \| ""]` | Committed range and editable input drafts. A draft may be empty while replacing a value. |
| `handleSliderChange(values)` | `function` | Pass to the Slider onValueChange. |
| `handleInputChange(event, index)` | `function` | Pass to each input onChange. |
| `validateAndUpdateValue(value, index)` | `function` | Commit a typed value on blur or Enter. |

## Usage

```jsx
import { useSliderInput } from '@gaudi/design-system/hooks';

const price = useSliderInput({ minValue: 0, maxValue: 500, initialValue: [50, 300] });
```

## Accessibility

Label both inputs ("Minimum price", "Maximum price") and both slider thumbs; the inputs give keyboard and screen reader users an exact entry.

## Notes

- Commit typed values on blur or Enter, not on every keystroke. Use parseFloat so an empty or invalid draft restores the previous committed value.

## Examples

- Range slider with exact inputs (Storybook `hooks-state-usesliderinput--range-with-inputs`)
