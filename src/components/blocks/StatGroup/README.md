# StatGroup

A responsive definition list for prepared metrics. Items supply id, label, value, optional detail and explicit tone. The system never calculates business values or assumes whether a change is favorable.

## Usage

```jsx
<StatGroup
  items={[
    {
      id: 'articles',
      label: 'Published articles',
      value: '24',
      detail: '3 published this month'
    }
  ]}
/>
```

## API

| Prop / export | Type                                 | Contract                                                            |
| ------------- | ------------------------------------ | ------------------------------------------------------------------- |
| `items`       | {id, label, value, detail?, tone?}[] | Prepared display values and explicit comparison tone.               |
| `label`       | string                               | Accessible name for the definition list.                            |
| `className`   | string                               | Additional layout classes; metrics reflow based on available width. |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
