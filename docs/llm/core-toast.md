# Toast

> Core/Toast · core · `@gaudi/design-system/core/Toast`

Transient feedback for completed actions, errors and recoverable background work.

## Import

```js
import Toast from '@gaudi/design-system/core/Toast';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `default`, `toast`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `position` | `top-left \| top-center \| top-right \| bottom-left \| bottom-center \| bottom-right` | `bottom-right` | no | Toast stack position. |
| `closeButton` | `boolean` | `true` | no | Show an explicit dismiss action. |
| `expand` | `boolean` | `false` | no | Show every toast in the stack instead of collapsing them behind the front one. |
| `duration` | `number` | `Sonner default` | no | Default display duration in milliseconds. |
| `toastOptions` | `ExternalToast` | `Gaudi class names` | no | Default appearance and behavior for each toast. |
| `toast(message, options)` | `function` | — | no | Show a message; options include description, action and cancellation. |
| `toast.promise(promise, options)` | `function` | — | no | Show loading, success and error feedback for one operation. |

## Variants

- `position`: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`

## Usage

```jsx
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import Button from '@gaudi/design-system/core/Button';

<><ToastProvider /><Button onClick={() => toast.success('Changes saved')}>Save</Button></>
```

## Accessibility

Use inline errors for fields and persistent failures. Keep toast actions keyboard accessible and allow enough time to act.

## Notes

- Mount one ToastProvider for a region. The toast API and additional provider props are forwarded from Sonner.

## Examples

- Playground (Storybook `core-toast--playground`)

Curated patterns:

- Actions — registry item `@gaudi/toast-actions` (uses `Button`, `ToastProvider`, `toast`)
- Progress and async work — registry item `@gaudi/toast-async-progress` (uses `Button`, `ProgressRoot`, `RegistryIcon`, `ToastProvider`, `toast`, `useInterval`, `useTimeout`)
- Custom content — registry item `@gaudi/toast-custom-content` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Button`, `Label`, `RegistryIcon`, `Separator`, `SwitchRoot`, `ToastProvider`, `toast`)
- Types and options — registry item `@gaudi/toast-types-options` (uses `Button`, `Label`, `NativeSelect`, `NativeSelectOption`, `RegistryIcon`, `SwitchRoot`, `ToastProvider`, `ToggleGroupItem`, `ToggleGroupRoot`, `toast`)

## README

Short, non-blocking notifications for finished actions, errors and background work. Mount one `ToastProvider` per app and call `toast()` from anywhere. The toast surface uses Gaudi tokens and its action, cancel and close buttons use the Button variants.

### Usage

```jsx
<ToastProvider />
<Button onClick={() => toast.success('Draft saved')}>Save draft</Button>
```

### API

| Prop / export   | Type             | Contract                                                                          |
| --------------- | ---------------- | --------------------------------------------------------------------------------- |
| `ToastProvider` | component        | Mount once; forwards Sonner configuration including position, duration and theme. `toastOptions.classNames` are merged with the Gaudi classes. |
| `toast`         | function         | Use toast(), toast.success(), toast.error(), toast.promise() and toast.dismiss(). |
| `action`        | {label, onClick} | Optional recovery or undo action on a notification.                               |

### Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
