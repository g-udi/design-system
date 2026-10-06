# Tabs

> Core/Tabs · core · `@gaudi/design-system/core/Tabs`

Switch between related panels with keyboard-accessible tab controls.

## Import

```js
import Tabs from '@gaudi/design-system/core/Tabs';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value / defaultValue / onValueChange` | `string / function` | — | no | Controlled or initial active tab. |
| `orientation` | `horizontal \| vertical` | `horizontal` | no | Visual layout and keyboard direction. |
| `activationMode` | `automatic \| manual` | `automatic` | no | Whether focus also activates a tab. |
| `TabsList.variant` | `underline \| outline \| type` | `underline` | no | How the active tab is marked: a short underline, a fine outline, or weight alone. default and line still map to underline. |
| `TabsList.tone` | `neutral \| accent \| info \| success \| warning \| danger \| discovery \| attention` | `neutral` | no | Colour of the underline or outline marker; neutral follows the text colour. |
| `TabsTrigger.value / TabsContent.value` | `string` | `Required` | no | Matching identity for the trigger and panel. |
| `TabsTrigger.disabled` | `boolean` | `false` | no | Exclude an unavailable tab from navigation. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `orientation`: `horizontal`, `vertical`
- `activationMode`: `automatic`, `manual`

## Usage

```jsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gaudi/design-system/core/Tabs';

<Tabs defaultValue='overview'>
  <TabsList aria-label='Project'><TabsTrigger value='overview'>Overview</TabsTrigger><TabsTrigger value='activity'>Activity</TabsTrigger></TabsList>
  <TabsContent value='overview'>{overview}</TabsContent>
  <TabsContent value='activity'>{activity}</TabsContent>
</Tabs>
```

## Accessibility

Radix associates tabs and panels. Label the tab list; use manual activation when loading panels is expensive.

## Examples

- Playground (Storybook `core-tabs--playground`)
- Manual Activation (Storybook `core-tabs--manual-activation`)
- Variants (Storybook `core-tabs--variants`)

Curated patterns:

- Badge counts — registry item `@gaudi/tabs-badge-counts` (uses `Badge`, `CardContent`, `CardRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`)
- Period switch — registry item `@gaudi/tabs-period-switch` (uses `CardContent`, `CardRoot`, `RegistryIcon`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`)
- Settings form tabs — registry item `@gaudi/tabs-settings-form` (uses `Button`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardRoot`, `CardTitle`, `EmailInput`, `FieldInput`, `Label`, `RegistryIcon`, `SwitchRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`)

## Related

`core-switch`

## README

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
