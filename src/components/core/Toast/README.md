# Toast

Sonner notifications styled with Gaudi tokens. Mount one ToastProvider per app. toast.success, toast.error and action callbacks provide non-blocking feedback.

## Usage

```jsx
<ToastProvider />
<Button onClick={() => toast.success('Draft saved')}>Save draft</Button>
```

## API

| Prop / export   | Type             | Contract                                                                          |
| --------------- | ---------------- | --------------------------------------------------------------------------------- |
| `ToastProvider` | component        | Mount once; forwards Sonner configuration including position, duration and theme. |
| `toast`         | function         | Use toast(), toast.success(), toast.error(), toast.promise() and toast.dismiss(). |
| `action`        | {label, onClick} | Optional recovery or undo action on a notification.                               |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
