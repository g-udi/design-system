# NewsletterForm

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
