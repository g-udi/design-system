# Toast

Short, non-blocking notifications for finished actions, errors and background work. Mount one `ToastProvider` per app and call `toast()` from anywhere. The toast surface uses Gaudi tokens and its action, cancel and close buttons use the Button variants.

## Usage

```jsx
<ToastProvider />
<Button onClick={() => toast.success('Draft saved')}>Save draft</Button>
```

## API

| Prop / export   | Type             | Contract                                                                          |
| --------------- | ---------------- | --------------------------------------------------------------------------------- |
| `ToastProvider` | component        | Mount once; forwards Sonner configuration including position, duration and theme. `toastOptions.classNames` are merged with the Gaudi classes. |
| `toast`         | function         | Use toast(), toast.success(), toast.error(), toast.promise() and toast.dismiss(). |
| `action`        | {label, onClick} | Optional recovery or undo action on a notification.                               |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
