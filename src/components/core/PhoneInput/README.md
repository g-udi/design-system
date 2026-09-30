# PhoneInput

A phone number field with a searchable country picker that stores the number in international (E.164) format.

## Usage

```jsx
import { PhoneInput } from '@gaudi/design-system';

<PhoneInput id='phone' defaultCountry='US' value={phone} onChange={setPhone} />;
```

`variant` (`sm`, `default`, `lg`) sets the height, and `international` shows the calling code in the input.

## Accessibility

Label the input with a `Label` or `aria-label`. Setting `aria-invalid` marks the country picker and the number together.
