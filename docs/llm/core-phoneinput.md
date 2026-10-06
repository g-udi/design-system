# PhoneInput

> Core/PhoneInput · core · `@gaudi/design-system/core/PhoneInput`

International phone entry with country selection and formatted numbers.

## Import

```js
import { PhoneInput } from '@gaudi/design-system/core/PhoneInput';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `PhoneInput`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | no | Phone number in international format. |
| `onChange` | `(value: string) => void` | — | no | Receives the entered number; cleared values are normalized to an empty string. |
| `defaultCountry` | `CountryCode` | — | no | Initial country when no international prefix is entered. |
| `variant` | `sm \| default \| lg` | `default` | no | Height of the country button and input. |
| `disabled / international` | `boolean` | — | no | Input availability and international number formatting. |
| `popupClassName / scrollAreaClassName` | `string` | — | no | Country menu and scrolling-region classes. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `sm`, `default`, `lg`

## Usage

```jsx
import { PhoneInput } from '@gaudi/design-system/core/PhoneInput';

<PhoneInput aria-label='Phone number' value={phone} onChange={setPhone} defaultCountry='GB' />
```

## Accessibility

Associate a visible label with the input and name the country selector. The application owns phone verification and validity feedback.

## Examples

- Playground (Storybook `core-phoneinput--playground`)

Curated patterns:

- Field states — registry item `@gaudi/phone-input-field-states` (uses `Label`, `PhoneInput`)

## Related

`core-input`

## README

A phone number field with a searchable country picker that stores the number in international (E.164) format.

### Usage

```jsx
import { PhoneInput } from '@gaudi/design-system';

<PhoneInput id='phone' defaultCountry='US' value={phone} onChange={setPhone} />;
```

`variant` (`sm`, `default`, `lg`) sets the height, and `international` shows the calling code in the input.

### Accessibility

Label the input with a `Label` or `aria-label`. Setting `aria-invalid` marks the country picker and the number together.
