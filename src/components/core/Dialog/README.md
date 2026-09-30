# Dialog

Modal, side-sheet and confirmation surfaces share the `Dialog` component. Confirmation dialogs require an explicit decision, retain `alertdialog` semantics and support pending and rejected async actions.

[Open the main Docs page](http://localhost:6007/?path=/docs/core-dialog--docs) for all **39 examples**, including confirmations, modals, drawers and sheets, each with copyable source.

## Usage

```jsx
import { Dialog } from '@gaudi/design-system';

<Dialog
  trigger={<Button>Edit title</Button>}
  title='Edit article'
  description='Update the title readers see.'
>
  <Field>
    <FieldLabel>Title</FieldLabel>
    <Input defaultValue='A useful idea' />
  </Field>
</Dialog>
```

Use the confirmation variant for actions that require an explicit decision:

```jsx
<Dialog
  variant='confirmation'
  trigger={<Button>Archive draft</Button>}
  title='Archive this draft?'
  description='You can restore it from the archive.'
  confirmLabel='Archive draft'
  onConfirm={archiveDraft}
/>
```

## API

| Prop / export                       | Type                         | Contract                                                        |
| ----------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| `trigger`                           | React element                | Optional button that opens the dialog; it must forward its ref. |
| `title / description`               | ReactNode                    | Accessible title and optional supporting description.           |
| `open / defaultOpen / onOpenChange` | boolean / boolean / function | Controlled or uncontrolled visibility.                          |
| `variant`                           | modal, sheet or confirmation | Modal is the default; confirmation uses explicit action/cancel behavior. |
| `children / footer`                 | ReactNode                    | Modal/sheet only: scrollable body and persistent action region.  |
| `contentProps`                      | object                       | Modal/sheet only: Radix content callbacks, including initial-focus customization. |
| `onConfirm`                         | () => void or Promise<void>  | Confirmation only: success closes; rejection displays recovery feedback. |
| `confirmLabel / cancelLabel / pendingLabel` | string               | Confirmation only: localized action copy.                       |
| `errorMessage / tone`               | string / semantic tone       | Confirmation only: recovery message and confirm-button intent.  |

## Composition and migration

Use `DialogRoot`, `DialogContent` and the other `Dialog*` parts for custom modals. Use `DialogConfirmationRoot`, `DialogConfirmationContent`, `DialogConfirmationAction`, `DialogConfirmationCancel` and their related parts for custom confirmations. These exports are available from the package root and `@gaudi/design-system/core/Dialog`.

Replace `<AlertDialog ... />` with `<Dialog variant='confirmation' ... />`. The previous `AlertDialog` and `AlertDialog*` exports remain compatibility aliases; their implementation and examples now belong to Dialog. Confirmation dialogs initially focus Cancel, prevent repeated submissions, block dismissal while pending, and restore focus when closed.

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
