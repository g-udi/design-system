# Tabs

Switches between related panels on the same page. Use it for views of one thing (overview, history, settings); use `NavigationMenu` or links when each view has its own URL.

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

| Prop / export | Type | Contract |
| --- | --- | --- |
| `value / defaultValue / onValueChange` | string / string / function | Controlled or uncontrolled active panel. |
| `orientation` | horizontal or vertical | List direction and arrow keys. |
| `activationMode` | automatic or manual | Select on focus, or wait for Enter/Space. |
| `TabsList variant` | default or line | `line` drops the rule under the list. |
| `TabsTrigger / TabsContent` | components | Match their `value`; triggers accept `disabled`. |

Label each `TabsList`. Use manual activation when a panel is expensive to load.

Keyboard focus is drawn inside each trigger, so the scrolling list never clips it. In forced-colours mode (Windows High Contrast) idle tabs drop their border and the selected tab draws it, and its underline, in `Highlight`.
