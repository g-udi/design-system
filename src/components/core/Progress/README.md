# Progress

Native determinate and indeterminate progress. Values are clamped to a finite positive max. Supply valueText for meaningful units and a label for the task.

## Usage

```jsx
import Progress from '@gaudi/design-system/core/Progress';

<Progress label='Uploading references' value={62} valueText='62%' />;
```

## Accessibility

The native progress element exposes its value; omitted or non-finite values stay indeterminate rather than inventing a percentage.

## Examples

Upload, Indeterminate, Completed in Storybook. All examples support light and dark themes.
