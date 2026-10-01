# Wizard

Sequential setup with async validation, back navigation, serialized submission, failure recovery and completion. Hosts own field values above the wizard, validateStep(index), and onComplete. A changed sequence of step IDs resets the flow and discards stale results.

## Usage

```jsx
const [name, setName] = useState('');
<Wizard
  title='Create a collection'
  steps={[
    { id: 'details', label: 'Details' },
    { id: 'review', label: 'Review' }
  ]}
  validateStep={() => Boolean(name.trim())}
  onComplete={saveCollection}
>
  {(step) =>
    step === 0 ? (
      <Input
        aria-label='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    ) : (
      <p>{name}</p>
    )
  }
</Wizard>;
```

## API

| Prop / export                                               | Type                                           | Contract                                                                               |
| ----------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| `steps`                                                     | {id, label, description?}[]                    | Ordered stable stage IDs; changing the sequence resets the flow.                       |
| `children`                                                  | function(index)                                | Stage content. Keep form values above Wizard.                                          |
| `validateStep`                                              | function(index) => boolean or Promise<boolean> | False prevents progress. All preceding stages are rechecked before advance/completion. |
| `onComplete`                                                | function() => void or Promise<void>            | Required host action; rejection retains the form for retry.                            |
| `title / description`                                       | ReactNode                                      | Flow context.                                                                          |
| `completionTitle / completionDescription`                   | ReactNode                                      | Success content after the callback resolves.                                           |
| `labels / completeLabel / errorMessage / validationMessage` | object / string                                | Localized action and state copy.                                                       |
| `indicator`                                                 | steps, progress, dots or vertical              | Numbered steps, a progress bar, compact dots or a vertical list beside the form.       |
| `aside`                                                     | ReactNode or function(index, complete)         | A live summary or preview beside the form.                                             |
| `navigable`                                                 | boolean                                        | Completed steps become buttons that go back; steps ahead stay behind validation.       |
| `completion`                                                | ReactNode                                      | Replaces the default finished state, for example a celebration with next actions.      |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
