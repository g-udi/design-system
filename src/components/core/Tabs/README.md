# Tabs

Composable tabs for views within the same page. Supports controlled value, defaultValue, horizontal/vertical orientation and manual activation.

## Usage

```jsx
<Tabs defaultValue='overview'>
  <TabsList aria-label='Article'>
    <TabsTrigger value='overview'>Overview</TabsTrigger>
    <TabsTrigger value='history'>History</TabsTrigger>
  </TabsList>
  <TabsContent value='overview'>Article details</TabsContent>
  <TabsContent value='history'>Revision history</TabsContent>
</Tabs>
```

## API

| Prop / export                          | Type                       | Contract                                            |
| -------------------------------------- | -------------------------- | --------------------------------------------------- |
| `value / defaultValue / onValueChange` | string / string / function | Controlled or uncontrolled active panel.            |
| `orientation`                          | horizontal or vertical     | Keyboard and list direction.                        |
| `activationMode`                       | automatic or manual        | Select on focus or require Enter/Space.             |
| `TabsList`                             | component                  | Provide an aria-label identifying the group.        |
| `TabsTrigger / TabsContent`            | components                 | Match their value props; triggers support disabled. |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
