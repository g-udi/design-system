# NewsletterForm

> Layout/NewsletterForm · layout · `@gaudi/design-system/layout/NewsletterForm`

Email subscription form with an explicit host endpoint and local pending, success, and error feedback.

## Import

```js
import NewsletterForm from '@gaudi/design-system/layout/NewsletterForm';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `endpoint` | `string` | — | no | Host endpoint that receives a POST; absent endpoints disable signup. |
| `title` | `string` | `Subscribe to the newsletter` | no | Visible form heading. |
| `className` | `string` | — | no | Root layout classes. |
| `classNames` | `{ root?, title?, description?, form?, input?, action?, button?, message? }` | `{}` | no | Part-specific classes. |

## Usage

```jsx
import NewsletterForm from '@gaudi/design-system/layout/NewsletterForm';

<NewsletterForm title='Monthly field notes' endpoint='/api/newsletter' />
```

## Accessibility

Uses EmailInput with single-address pattern validation and the default smooth caret. Names the email input, preserves the submitted address on failure, disables duplicate submissions, and announces feedback beside the field.

## Examples

- NewsletterForm (Storybook `layout-components--newsletter`)
