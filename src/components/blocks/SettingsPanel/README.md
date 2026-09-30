# SettingsPanel

Responsive settings sections with title, description, field area and footer. Compose related sections within one host-owned form. Labels sit beside fields on wide screens and above them on phones.

## Usage

```jsx
<SettingsPanel title='Profile' description='How readers see you.' footer={<Button type='submit'>Save</Button>}<Field><FieldLabel>Name</FieldLabel><Input name='name' /></Field></SettingsPanel>
```

## API

| Prop / export         | Type      | Contract                                               |
| --------------------- | --------- | ------------------------------------------------------ |
| `title / description` | ReactNode | Named section and contextual guidance.                 |
| `children`            | ReactNode | Fields, groups, or preference controls.                |
| `footer`              | ReactNode | Host-owned save actions and feedback.                  |
| `className`           | string    | Additional section classes. Layout stacks below 640px. |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
