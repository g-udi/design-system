# Dialog

> Core/Dialog · core · `@gaudi/design-system/core/Dialog`

Modal, confirmation and bare full-screen dialogs for editing, detail inspection, explicit decisions, lightboxes and launchers.

## Import

```js
import Dialog from '@gaudi/design-system/core/Dialog';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `DialogClose`, `DialogClosePrimitive`, `DialogConfirmationAction`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationHeader`, `DialogConfirmationMedia`, `DialogConfirmationOverlay`, `DialogConfirmationPortal`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `DialogConfirmationTrigger`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogOverlay`, `DialogPortal`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `Drawer`, `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerFooter`, `DrawerHeader`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DrawerTrigger`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `modal \| confirmation \| bare` | `modal` | no | Presentation and interaction contract; side panels use Sheet. |
| `label` | `string` | — | no | Bare only: the accessible name without a visible title, the portal container, the element focused on open, and the fallback focus target when the opener is gone. |
| `container` | `Element` | — | no | Bare only: the accessible name without a visible title, the portal container, the element focused on open, and the fallback focus target when the opener is gone. |
| `initialFocusRef` | `Ref` | — | no | Bare only: the accessible name without a visible title, the portal container, the element focused on open, and the fallback focus target when the opener is gone. |
| `restoreFocusRef` | `Ref` | — | no | Bare only: the accessible name without a visible title, the portal container, the element focused on open, and the fallback focus target when the opener is gone. |
| `trigger` | `ReactElement` | — | no | A ref-forwarding button that opens the dialog. |
| `title / description` | `ReactNode` | — | no | Accessible title and optional supporting description. |
| `open / defaultOpen` | `boolean` | — | no | Controlled or initial open state. Use one state model for the lifetime of the component. |
| `onOpenChange` | `(open: boolean) => void` | — | no | Responds to open and close requests. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `footer` | `ReactNode` | — | no | Actions in the modal or sheet footer. |
| `closeLabel` | `string` | `Close dialog` | no | Accessible name of the close button. |
| `contentProps` | `DialogContentProps` | — | no | Modal or sheet content and focus overrides. |
| `onConfirm` | `() => void \| Promise<void>` | — | no | Confirmation only: resolving closes; rejecting keeps the dialog open for retry. |
| `confirmLabel / cancelLabel / pendingLabel` | `string` | `Confirm / Cancel / Working…` | no | Labels for confirmation mode. |
| `errorMessage` | `string` | `The action could not be completed. Please try again.` | no | Feedback when the confirmation promise rejects. |
| `tone` | `accent \| danger` | `danger` | no | Confirmation action tone. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `modal`, `confirmation`, `bare`
- `tone`: `accent`, `danger`

## Usage

```jsx
import Dialog from '@gaudi/design-system/core/Dialog';
import Button from '@gaudi/design-system/core/Button';

<Dialog title='Edit profile' description='Update your public details.'
  trigger={<Button>Edit profile</Button>}>
  {profileForm}
</Dialog>
```

## Accessibility

Focus stays in the dialog and returns to its trigger. Confirmation mode focuses Cancel and blocks dismissal while a decision is pending.

## Notes

- Use DialogClose for modal and sheet actions. Confirmation mode owns its actions and pending state; children and footer apply to modal and sheet variants.

## Examples

- Playground (Storybook `core-dialog--playground`)
- Async confirmation (Storybook `core-dialog--confirmation`)
- Bare full-screen surface (Storybook `core-dialog--bare-surface`)

Curated patterns:

- Checklist before an action — registry item `@gaudi/confirmation-checklist` (uses `Badge`, `Button`, `DialogConfirmationAction`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationMedia`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `DialogConfirmationTrigger`, `RegistryIcon`)
- Confirmation with a don't-ask-again option — registry item `@gaudi/confirmation-dont-ask-again` (uses `Button`, `CheckboxRoot`, `DialogConfirmationAction`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `DialogConfirmationTrigger`, `Label`, `RegistryIcon`)
- Confirmation layouts — registry item `@gaudi/confirmation-layouts` (uses `Button`, `DialogConfirmationAction`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationHeader`, `DialogConfirmationMedia`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `DialogConfirmationTrigger`, `RegistryIcon`)
- Confirmation nested in a dialog — registry item `@gaudi/confirmation-nested-dialog` (uses `Button`, `DialogConfirmationAction`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationHeader`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `DialogConfirmationTrigger`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`)
- Notice with a status badge — registry item `@gaudi/confirmation-status-notice` (uses `Badge`, `Button`, `DialogConfirmationAction`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationMedia`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `DialogConfirmationTrigger`, `RegistryIcon`)
- Success summary with details — registry item `@gaudi/confirmation-success-summary` (uses `Button`, `DialogConfirmationCancel`, `DialogConfirmationContent`, `DialogConfirmationDescription`, `DialogConfirmationFooter`, `DialogConfirmationMedia`, `DialogConfirmationRoot`, `DialogConfirmationTitle`, `DialogConfirmationTrigger`, `RegistryIcon`)
- Close button and footer options — registry item `@gaudi/dialog-close-footer` (uses `Button`, `DialogClosePrimitive`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`)
- Form dialog — registry item `@gaudi/dialog-form` (uses `Button`, `DialogClosePrimitive`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`)
- Scrollable content — registry item `@gaudi/dialog-scrollable` (uses `Button`, `DialogClosePrimitive`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`)
- Settings with switches — registry item `@gaudi/dialog-settings-switches` (uses `Button`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `Label`, `SwitchRoot`)
- Keyboard shortcuts list — registry item `@gaudi/dialog-shortcuts-list` (uses `Button`, `DialogClosePrimitive`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `KbdRoot`)
- Drawer from each edge — registry item `@gaudi/drawer-edges` (uses `Button`, `Drawer`, `DrawerClose`, `DrawerContent`, `DrawerDescription`, `DrawerFooter`, `DrawerHeader`, `DrawerTitle`, `DrawerTrigger`)

## Related

`core-sheet`

## README

Modal, confirmation and bare full-screen surfaces share the `Dialog` component. Use a modal to edit or inspect something without leaving the page, a confirmation for decisions that need an explicit answer, and `bare` for lightboxes, players and launchers that bring their own layout. Use `Sheet` for side panels.

[Open the Docs page](http://localhost:6007/?path=/docs/core-dialog--docs) for every example with copyable source.

### Usage

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

### API

| Prop / export                       | Type                         | Contract                                                        |
| ----------------------------------- | ---------------------------- | --------------------------------------------------------------- |
| `trigger`                           | React element                | Optional button that opens the dialog; it must forward its ref. |
| `title / description`               | ReactNode                    | Accessible title and optional supporting description.           |
| `open / defaultOpen / onOpenChange` | boolean / boolean / function | Controlled or uncontrolled visibility.                          |
| `variant`                           | modal, confirmation or bare | Modal is the default; confirmation uses explicit action/cancel behavior; bare drops the chrome. |
| `label / container / initialFocusRef / restoreFocusRef` | string / Element / Ref / Ref | Bare only: accessible name without a visible title, portal container, first focus, and fallback focus target. |
| `children / footer`                 | ReactNode                    | Modal: scrollable body and persistent action region. Bare: the whole surface. |
| `contentProps`                      | object                       | Modal and bare: Radix content callbacks, including initial-focus customization. |
| `onConfirm`                         | () => void or Promise<void>  | Confirmation only: success closes; rejection displays recovery feedback. |
| `confirmLabel / cancelLabel / pendingLabel` | string               | Confirmation only: localized action copy.                       |
| `errorMessage / tone`               | string / semantic tone       | Confirmation only: recovery message and confirm-button intent.  |

### Composition and migration

`Dialog` reuses its exported title and description parts, so prop-driven and compound dialogs share typography and accessible naming. It is built on the same Radix parts it exports. Use `DialogRoot`, `DialogContent` and the other `Dialog*` parts for custom modals. Use `DialogConfirmationRoot`, `DialogConfirmationContent`, `DialogConfirmationAction`, `DialogConfirmationCancel` and their related parts for custom confirmations. These exports are available from the package root and `@gaudi/design-system/core/Dialog`.

Replace `<AlertDialog ... />` with `<Dialog variant='confirmation' ... />`. The previous `AlertDialog` and `AlertDialog*` aliases have been removed. Use `DialogConfirmationRoot` and its parts for compound confirmations. Confirmation dialogs initially focus Cancel, prevent repeated submissions, block dismissal while pending, and restore focus when closed.

### Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
