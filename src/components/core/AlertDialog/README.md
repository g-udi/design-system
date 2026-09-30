# AlertDialog compatibility

AlertDialog is now the confirmation variant of [Dialog](../Dialog/README.md). Existing imports remain compatible. Use `Dialog` for new code.

[Open the Dialog Docs page](http://localhost:6007/?path=/docs/core-dialog--docs) for all 39 examples, including the 17 confirmation workflows and patterns.

## Usage

```jsx
import { Dialog } from '@gaudi/design-system';

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

| Prop / export                               | Type                        | Contract                                                                        |
| ------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| `trigger / title / description`             | ReactNode                   | Button and accessible confirmation context.                                     |
| `onConfirm`                                 | () => void or Promise<void> | Required action; a rejection retains the dialog and displays recovery feedback. |
| `open / onOpenChange`                       | boolean / function          | Optional controlled visibility.                                                 |
| `confirmLabel / cancelLabel / pendingLabel` | string                      | Localized action copy.                                                          |
| `errorMessage / tone`                       | string / semantic tone      | Recovery message and confirm-button intent.                                     |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
