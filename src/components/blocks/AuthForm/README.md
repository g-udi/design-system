# AuthForm

Password and email-link form recipes with native validation, pending state and recoverable errors. onSubmit receives form values. Applications own providers, credentials, sessions and navigation.

## Usage

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

## API

| Prop / export                                 | Type                         | Contract                                                              |
| --------------------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `onSubmit`                                    | function({email, password?}) | Required host-owned authentication callback. Reject to show an error. |
| `mode`                                        | password or email            | Password or email-link form.                                          |
| `title / description / footer`                | ReactNode                    | Product context and links.                                            |
| `submitLabel / successMessage / errorMessage` | string                       | Action and outcome copy.                                              |
| `emailLabel / passwordLabel`                  | string                       | Visible accessible field labels.                                      |
| `emailPlaceholder / passwordPlaceholder`      | string                       | Optional example text inside the fields. No placeholder by default.   |
| `passwordHint`                                | ReactNode or false           | Help text under the password. Defaults to a generic hint; `false` hides it. |
| `pendingLabel`                                | string                       | Submit text while `onSubmit` is pending. Defaults to `Signing in…`.   |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
