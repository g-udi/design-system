# Auth

> Blocks/Auth · blocks · `@gaudi/design-system/blocks/AuthForm`

Sign-in, sign-up, magic-link, passkey and single sign-on screens: AuthForm handles the fields, feedback and providers, and Screen frames it beside imagery, quotes or logos.

## Import

```js
import Auth from '@gaudi/design-system/blocks/AuthForm';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `mode` | `password \| email \| signup` | `password` | no | Authentication form fields; email sends a sign-in link without a password, signup adds a name and a new password. Password fields have a reveal button. |
| `onSubmit` | `(values) => void \| Promise<void>` | — | no | Host-owned authentication request. |
| `title / submitLabel` | `string` | `Sign in` | no | Form heading and submission action. |
| `description / footer` | `ReactNode` | — | no | Instructions and related actions. |
| `nameLabel / emailLabel / passwordLabel` | `string` | `Full name / Email / Password` | no | Input labels. |
| `emailPlaceholder / passwordPlaceholder` | `string` | — | no | Optional example text inside the fields. |
| `passwordMinLength` | `number` | — | no | Optional host-defined native minimum; signup has no built-in password length policy. |
| `passwordHint` | `ReactNode \| false` | `Per mode` | no | Help text under the password field; false hides it. |
| `passwordAction` | `ReactNode` | — | no | A link beside the password label, such as Forgot password. |
| `identifier` | `email \| username` | `email` | no | Ask for an email, or a username that also accepts an email. |
| `providers` | `Array<{ id, label, icon }>` | — | no | Single sign-on buttons above the form, sharing its pending and error state. |
| `onProvider` | `(id) => void \| Promise<void>` | — | no | Single sign-on buttons above the form, sharing its pending and error state. |
| `providerLayout` | `grid \| stack` | `grid` | no | Provider buttons side by side or stacked, and the divider before the email fields. |
| `dividerLabel` | `string` | `or` | no | Provider buttons side by side or stacked, and the divider before the email fields. |
| `showPasswordLabel / hidePasswordLabel` | `string` | `Show password / Hide password` | no | Accessible names of the password reveal button, for translation. |
| `children` | `ReactNode` | — | no | Extra fields before the submit button, such as keep me signed in or terms. |
| `pendingLabel` | `string` | `Per mode` | no | Submit text while the request is pending. |
| `successMessage / errorMessage` | `string` | `Built-in feedback` | no | Submission result messages. |
| `Screen` | `component` | — | no | Full-screen frame: the form beside an optional aside, with header and footer bands. See the Screen frame example for its props. |

## Variants

- `mode`: `password`, `email`, `signup`
- `identifier`: `email`, `username`
- `providerLayout`: `grid`, `stack`

## Usage

```jsx
import AuthForm from '@gaudi/design-system/blocks/AuthForm';

<AuthForm mode='password' onSubmit={signIn} />
```

## Accessibility

Native labels and autocomplete support password managers; the password keeps its label and hint when revealed. Pending submissions and provider redirects share one guard so requests never overlap; errors retain the user’s values.

## Examples

- Playground (Storybook `blocks-application-authform--playground`)
- Failed Sign In (Storybook `blocks-application-authform--failed-sign-in`)
- Forgot Password (Storybook `blocks-application-authform--forgot-password`)
- Password Hint And Placeholders (Storybook `blocks-application-authform--password-hint-and-placeholders`)

Curated patterns:

- Centred card — registry item `@gaudi/screens-centred-card` (uses `AuthForm`, `CardContent`, `CardRoot`, `CheckboxRoot`, `GaudiBrand`, `Label`, `RegistryIcon`, `Screen`, `ToggleGroupItem`, `ToggleGroupRoot`, `cn`)
- Free trial sign-up — registry item `@gaudi/screens-free-trial` (uses `AuthForm`, `Badge`, `CheckboxRoot`, `Label`, `RegistryIcon`, `Screen`)
- Magic link with logos — registry item `@gaudi/screens-magic-link` (uses `AuthForm`, `Discord`, `Dropbox`, `Frame`, `FramePanel`, `GaudiBrand`, `Loom`, `Redis`, `Screen`, `ScreenTestimonial`, `Slack`, `Stripe`, `Supabase`, `Zoom`)
- Choose a sign-in method — registry item `@gaudi/screens-sign-in-methods` (uses `AuthForm`, `Button`, `Dropbox`, `GaudiBrand`, `InputOTP`, `InputOTPGroup`, `InputOTPSeparator`, `InputOTPSlot`, `Label`, `Loom`, `RegistryIcon`, `Screen`, `Stripe`, `Supabase`)
- Split with imagery — registry item `@gaudi/screens-split-imagery` (uses `AuthForm`, `Borealis`, `GaudiBrand`, `RegistryIcon`, `Screen`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Split with testimonials — registry item `@gaudi/screens-split-testimonials` (uses `AuthForm`, `GaudiBrand`, `RegistryIcon`, `Screen`, `ScreenTestimonial`)

## Related

`core-input`

## README

Password and email-link form recipes with native validation, pending state and recoverable errors. onSubmit receives form values. Applications own providers, credentials, sessions and navigation.

### Usage

```jsx
<AuthForm
  title='Sign in'
  description='Continue to your writing workspace.'
  onSubmit={signIn}
/>
```

Reuse the recipe for other account steps by renaming the copy: a reset request is `mode='email'` with its own `submitLabel`
and `pendingLabel`.

```jsx
<AuthForm
  title='Reset your password'
  mode='email'
  submitLabel='Send reset link'
  pendingLabel='Sending…'
  emailPlaceholder='you@example.com'
  successMessage='If that address has an account, a reset link is on its way.'
  onSubmit={requestReset}
/>
```

Add single sign-on above the email fields and a reset link beside the password:

```jsx
<AuthForm
  title='Welcome back'
  passwordAction={<Link href='/reset'>Forgot password?</Link>}
  providers={[{ id: 'google', label: 'Google', icon: <Icon name='Google' decorative /> }]}
  onProvider={startOAuth}
  onSubmit={signIn}
/>
```

### API

| Prop / export                                 | Type                         | Contract                                                              |
| --------------------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `onSubmit`                                    | function({email, password?}) | Required host-owned authentication callback. Reject to show an error. |
| `mode`                                        | password, email or signup    | Password, email-link or sign-up form (name, email, new password).     |
| `title / description / footer`                | ReactNode                    | Product context and links.                                            |
| `submitLabel / successMessage / errorMessage` | string                       | Action and outcome copy.                                              |
| `nameLabel / emailLabel / passwordLabel`      | string                       | Visible accessible field labels.                                      |
| `emailPlaceholder / passwordPlaceholder`      | string                       | Optional example text inside the fields. No placeholder by default.   |
| `passwordHint`                                | ReactNode or false           | Help text under the password; defaults per mode, `false` hides it.    |
| `passwordMinLength` | number | Optional native minimum supplied by the host; signup imposes no minimum by default. Pair it with a matching `passwordHint`. |
| `passwordAction`                              | ReactNode                    | A link beside the password label, such as Forgot password.            |
| `identifier`                                  | email or username            | `username` asks for a username field that also accepts an email.      |
| `providers / onProvider`                      | {id, label, icon}[] / fn(id) | Sign-on buttons above the form; they share its pending and error state. |
| `providerLayout / dividerLabel`               | grid or stack / string       | Provider buttons side by side or stacked, and the divider copy.       |
| `showPasswordLabel / hidePasswordLabel` | string | Reveal-button names; default `Show password` / `Hide password`. |
| `children`                                    | ReactNode                    | Extra fields before submit, such as keep me signed in or terms.       |
| `pendingLabel`                                | string                       | Submit text while `onSubmit` is pending. Defaults per mode.           |

Email identifiers use `EmailInput`, so they inherit the default smooth caret and single-address pattern validation. Username identifiers remain text inputs; masked passwords retain the native caret. A surrounding `InputConfigProvider caretMode='native'` opts the form out of smooth mode.

### Ownership and verification

The host supplies password policy (`passwordMinLength` and matching help text), data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
