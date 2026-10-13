# Newsletter

> Blocks/Marketing/Newsletter · layout · `@gaudi/design-system/layout/NewsletterForm`

Newsletter sections built from one email subscription form, with an explicit host endpoint and local pending, success, and error feedback.

## Import

```js
import Newsletter from '@gaudi/design-system/layout/NewsletterForm';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `endpoint` | `string` | — | no | Host endpoint that receives a POST; absent endpoints disable signup. |
| `title` | `ReactNode` | `Subscribe to the newsletter` | no | Visible form heading. Pass null to omit it. |
| `description` | `ReactNode` | `Get new articles and resources in your inbox.` | no | Supporting copy. Pass null to omit it. |
| `headingAs` | `string` | `h3` | no | Heading level in the host page. |
| `titleVariant` | `string` | — | no | Shared Typography variant; omitted preserves the compact form heading. |
| `children` | `ReactNode` | — | no | Supporting content below the form and feedback, such as a privacy note. |
| `className` | `string` | — | no | Root layout classes. |
| `classNames` | `{ root?, header?, body?, title?, description?, form?, input?, action?, button?, message? }` | `{}` | no | Part-specific classes. |

## Usage

```jsx
import NewsletterForm from '@gaudi/design-system/layout/NewsletterForm';

<NewsletterForm title='Monthly field notes' endpoint='/api/newsletter' />
```

## Accessibility

Uses EmailInput with single-address pattern validation and the default smooth caret. Names the email input, preserves the submitted address on failure, disables duplicate submissions, and announces feedback beside the field.

## Examples

- Form and availability (Storybook `layout-components--newsletter`)
- Centered (Storybook `layout-newsletter-form--playground`)
- Split (Storybook `layout-newsletter-form--split`)
- Image panel (Storybook `layout-newsletter-form--image-panel`)
- Compact (Storybook `layout-newsletter-form--compact`)
- Submission error (Storybook `layout-newsletter-form--submission-error`)

## README

One subscription form for footer embeds and **Blocks → Marketing → Newsletter** sections. The public import remains `@gaudi/design-system/layout/NewsletterForm`.

```jsx
import NewsletterForm from '@gaudi/design-system/layout/NewsletterForm';

<NewsletterForm
  endpoint='/api/newsletter'
  title='Notes worth sharing.'
  description='New writing and useful resources from our journal.'
  headingAs='h2'
  titleVariant='heading-xl'
>
  <p>Unsubscribe whenever you like.</p>
</NewsletterForm>
```

The host endpoint receives a POST with `{ email }`. A successful HTTP response without an `error` value confirms the subscription. Failed requests preserve the address for retry; pending and successful forms prevent duplicate submission. Endpoint changes and unmounts abort pending work. Without an endpoint, signup is disabled and an unavailable message is shown.

`title` and `description` accept content or `null`. `headingAs` defaults to `h3`; `titleVariant` optionally selects a shared Typography variant. Omit it to retain the compact heading used by existing embeds. `children` follows submission feedback. `classNames` accepts `root`, `header`, `body`, `title`, `description`, `form`, `input`, `action`, `button`, and `message`.

The EmailInput owns single-address validation and caret behavior. Feedback uses an alert for errors and a status for success. All examples share this implementation; section layout styles and local sample endpoints stay in the story fixtures. The response control switches between success, error, and unavailable and resets the example. Demo addresses are never sent to a subscription service.
