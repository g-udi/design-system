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

## API

| Prop / export                                 | Type                         | Contract                                                              |
| --------------------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `onSubmit`                                    | function({email, password?}) | Required host-owned authentication callback. Reject to show an error. |
| `mode`                                        | password or email            | Password or email-link form.                                          |
| `title / description / footer`                | ReactNode                    | Product context and links.                                            |
| `submitLabel / successMessage / errorMessage` | string                       | Action and outcome copy.                                              |
| `emailLabel / passwordLabel`                  | string                       | Visible accessible field labels.                                      |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
