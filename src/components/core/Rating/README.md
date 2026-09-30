# Rating

Shows a score as stars, or lets people choose one. Use it for reviews and feedback.

## Usage

```jsx
import { Rating } from '@gaudi/design-system';

<Rating rating={4.5} showValue />
<Rating rating={score} editable onRatingChange={setScore} />;
```

`size` is `sm`, `default` or `lg`, `maxRating` sets the number of stars, and `starClassName` restyles the stars.

## Accessibility

A read-only rating is one image named "Rated 4.5 out of 5". An editable rating is a radio group: arrow keys move and select, Home and End jump to the ends.
