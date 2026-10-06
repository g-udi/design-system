# Rating

> Core/Rating · core · `@gaudi/design-system/core/Rating`

Display a rating or let people select a score using labelled stars.

## Import

```js
import { Rating } from '@gaudi/design-system/core/Rating';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Rating`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `rating` | `number` | — | no | Current score. |
| `maxRating` | `number` | `5` | no | Maximum score. |
| `editable` | `boolean` | `false` | no | Enable score selection. |
| `onRatingChange` | `(rating: number) => void` | — | no | Receives a new score. |
| `showValue` | `boolean` | `false` | no | Display the numeric score. |
| `size / starClassName` | `string` | — | no | Star sizing and style override. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { Rating } from '@gaudi/design-system/core/Rating';

<Rating aria-label='Rate this article' value={rating} onValueChange={setRating} />
```

## Accessibility

Editable ratings expose keyboard-operable controls. Include enough text to explain the score and its range.

## Examples

- Playground (Storybook `core-rating--playground`)

Curated patterns:

- Display options — registry item `@gaudi/rating-display-options` (uses `Rating`)
- Emoji reactions — registry item `@gaudi/rating-emoji-reactions` (uses `ToggleGroupItem`, `ToggleGroupRoot`)
- Review form — registry item `@gaudi/rating-review-form` (uses `Button`, `CardContent`, `CardRoot`, `Label`, `Rating`, `Textarea`, `ToastProvider`, `toast`)
- Review summary — registry item `@gaudi/rating-review-summary` (uses `ProgressRoot`, `Rating`, `Separator`)

## README

Shows a score as stars, or lets people choose one. Use it for reviews and feedback.

### Usage

```jsx
import { Rating } from '@gaudi/design-system';

<Rating rating={4.5} showValue />
<Rating rating={score} editable onRatingChange={setScore} />;
```

`size` is `sm`, `default` or `lg`, `maxRating` sets the number of stars, and `starClassName` restyles the stars.

### Accessibility

A read-only rating is one image named "Rated 4.5 out of 5". An editable rating is a radio group: arrow keys move and select, Home and End jump to the ends.
