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

## API

| Prop / export                                 | Type                         | Contract                                                              |
| --------------------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `onSubmit`                                    | function({email, password?}) | Required host-owned authentication callback. Reject to show an error. |
| `mode`                                        | password, email or signup    | Password, email-link or sign-up form (name, email, new password).     |
| `title / description / footer`                | ReactNode                    | Product context and links.                                            |
| `submitLabel / successMessage / errorMessage` | string                       | Action and outcome copy.                                              |
| `nameLabel / emailLabel / passwordLabel`      | string                       | Visible accessible field labels.                                      |
| `emailPlaceholder / passwordPlaceholder`      | string                       | Optional example text inside the fields. No placeholder by default.   |
| `passwordHint`                                | ReactNode or false           | Help text under the password; defaults per mode, `false` hides it.    |
| `passwordAction`                              | ReactNode                    | A link beside the password label, such as Forgot password.            |
| `identifier`                                  | email or username            | `username` asks for a username field that also accepts an email.      |
| `providers / onProvider`                      | {id, label, icon}[] / fn(id) | Sign-on buttons above the form; they share its pending and error state. |
| `providerLayout / dividerLabel`               | grid or stack / string       | Provider buttons side by side or stacked, and the divider copy.       |
| `children`                                    | ReactNode                    | Extra fields before submit, such as keep me signed in or terms.       |
| `pendingLabel`                                | string                       | Submit text while `onSubmit` is pending. Defaults per mode.           |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
