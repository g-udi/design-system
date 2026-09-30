# ResourceList

Semantic collection lists with stable IDs, a renderItem slot, loading skeletons and actionable empty states. Consumers choose links and independent row actions.

## Usage

```jsx
<ResourceList
  label='Drafts'
  items={drafts}
  renderItem={(draft) => <a href={draft.href}>{draft.title}</a>}
/>
```

## API

| Prop / export                                  | Type            | Contract                                                                   |
| ---------------------------------------------- | --------------- | -------------------------------------------------------------------------- |
| `items`                                        | {id, ...data}[] | Prepared records with stable IDs.                                          |
| `renderItem`                                   | function(item)  | Visible row content; independent controls must not be nested inside links. |
| `loading`                                      | boolean         | Busy status and skeleton rows.                                             |
| `label`                                        | string          | Accessible collection name.                                                |
| `emptyTitle / emptyDescription / emptyActions` | ReactNode       | Empty-state content and recovery action.                                   |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
