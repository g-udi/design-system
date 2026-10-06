# Accordion

> Core/Accordion · core · `@gaudi/design-system/core/Accordion`

Rich disclosure for FAQs, settings, member directories, nested help, and guided setup. Eleven patterns use Gaudi tokens, icons, avatars, cards, and pills.

## Import

```js
import Accordion from '@gaudi/design-system/core/Accordion';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Accordion`, `AccordionContent`, `AccordionGroup`, `AccordionItem`, `AccordionRoot`, `AccordionTrigger`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `Array<{ value, title, content, disabled?, leading?, description?, badge?, indicator?, indicatorPosition?, headingLevel?, forceMount?, className?, triggerClassName?, contentClassName? }>` | `[]` | no | Convenience group items. Rich slots accept React nodes. |
| `type` | `single \| multiple` | `single` | no | Allow one or several expanded panels. |
| `variant` | `outline \| flush \| separated \| solid \| framed` | `outline` | no | Shared border, quiet dividers, individual borders, muted items, or an inset frame. |
| `defaultValue` | `string \| string[] \| null` | `first enabled item (group)` | no | Initial uncontrolled state. Use null or [] to start collapsed. |
| `value / onValueChange` | `string \| string[] \| undefined / function` | — | no | Controlled state. Single close emits undefined; multiple close emits an array. |
| `collapsible` | `boolean` | `true` | no | Allow the current single item to close. Set false to keep the active item expanded. |
| `disabled` | `boolean` | `false` | no | Disable all root items or one AccordionItem. |
| `indicator` | `chevron \| plus-minus \| arrow \| ReactNode \| ({isOpen}) => ReactNode \| null` | `chevron` | no | Root default with per-trigger or per-item overrides. |
| `indicatorPosition` | `start \| end` | `end` | no | Logical indicator position, including RTL. |
| `highlight` | `boolean` | `false` | no | Use the accent surface on expanded headers. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | no | Heading level; override per item or trigger. |
| `leading / description / badge` | `ReactNode` | — | no | Noninteractive slots on AccordionTrigger or group items. |
| `forceMount` | `boolean` | `false` | no | Retain closed panel children, hidden and inert, to preserve form drafts. |
| `children` | `ReactNode \| render function` | — | no | AccordionRoot compound children or the legacy state render function. |
| `className / ref / DOM attributes` | `native props` | — | no | Root, item, and trigger forward native props; content className styles its padded inner body. |

## Variants

- `type`: `single`, `multiple`
- `variant`: `outline`, `flush`, `separated`, `solid`, `framed`
- `indicatorPosition`: `start`, `end`
- `headingLevel`: `2`, `3`, `4`, `5`, `6`

## Usage

```jsx
import { AccordionGroup } from '@gaudi/design-system';

<AccordionGroup
  items={[
    { value: 'usage', title: 'When should I use it?', content: 'Use accordions for compact progressive disclosure.' },
  ]}
/>
```

## Accessibility

Radix-backed native buttons expose expanded state and labelled panels. Arrow Up/Down and Home/End navigate enabled headers within the current accordion; Enter/Space toggle. Disabled items are skipped. Headings default to h3 and can follow the document hierarchy. Closed panels are inert during animation and unmounted afterward; forceMount retains hidden, inert content. Reduced motion is respected.

## Notes

- `Accordion` and `AccordionGroup` from the package root are the items-based convenience API. Use `AccordionRoot` for compound composition. The named `Accordion` from the `core/Accordion` subpath remains the compound root for compatibility.
- Give every item a stable, unique, non-empty string value. Single mode uses a string; multiple mode uses an array. An explicit undefined controlled value collapses every panel.
- The group opens the first enabled item by default. Use `defaultValue={null}` for a collapsed single group or `defaultValue={[]}` in multiple mode. AccordionRoot starts closed unless a default is supplied.
- Existing render-function children and explicit `isOpen` / `onClick` composition remain supported. New compound usage manages state and ARIA associations automatically.
- Leading content and badges must be noninteractive. Put links, inputs, and action buttons inside AccordionContent. Provide an appropriate headingLevel for nested sections.
- forceMount preserves form state but does not omit closed inputs from native form submission. Consumers own persistence, validation, and submission scope.

## Examples

- Playground (Storybook `core-accordion--playground`)
- Multiple (Storybook `core-accordion--multiple`)
- Controlled (Storybook `core-accordion--controlled`)
- Always One Open (Storybook `core-accordion--always-one-open`)
- Compound (Storybook `core-accordion--compound`)
- Retained Form (Storybook `core-accordion--retained-form`)
- Custom Indicator (Storybook `core-accordion--custom-indicator`)
- Render Function (Storybook `core-accordion--render-function`)

Curated patterns:

- Disabled and highlighted — registry item `@gaudi/accordion-disabled-highlighted` (uses `AccordionGroup`, `Pill`)
- Guided setup — registry item `@gaudi/accordion-guided-setup` (uses `AccordionGroup`, `Button`, `Icon`, `Input`, `Pill`, `Progress`)
- Icons and badges — registry item `@gaudi/accordion-icons-badges` (uses `AccordionGroup`, `Icon`, `Pill`)
- Inside a card — registry item `@gaudi/accordion-in-card` (uses `AccordionGroup`, `Button`, `Card`)
- Member directory — registry item `@gaudi/accordion-member-directory` (uses `AccordionGroup`, `Avatar`, `Pill`)
- Nested sections — registry item `@gaudi/accordion-nested` (uses `AccordionGroup`)
- Variants and indicators — registry item `@gaudi/accordion-variants` (uses `AccordionGroup`)
- Collapsible: Advanced form fields — registry item `@gaudi/collapsible-advanced-fields` (uses `Button`, `CardContent`, `CardHeader`, `CardRoot`, `CardTitle`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `InputGroupAddon`, `InputGroupText`, `NumberField`, `NumberFieldGroup`, `NumberFieldInput`, `RegistryIcon`)
- Collapsible: Card that opens from its footer — registry item `@gaudi/collapsible-bottom-trigger` (uses `Button`, `CardAction`, `CardContent`, `CardHeader`, `CardRoot`, `CardTitle`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `ProgressRoot`, `RegistryIcon`)
- Collapsible: Tree view with file actions — registry item `@gaudi/collapsible-file-tree` (uses `Button`, `CardContent`, `CardHeader`, `CardRoot`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `Item`, `ItemActions`, `ItemMedia`, `ItemTitle`, `RegistryIcon`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`)
- Collapsible: Framed sections — registry item `@gaudi/collapsible-framed-sections` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `Frame`, `FrameHeader`, `FramePanel`, `RegistryIcon`, `useCopyToClipboard`)
- Collapsible: Show more details — registry item `@gaudi/collapsible-show-more` (uses `Badge`, `Button`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `RegistryIcon`)

## README

Stacked sections whose headers expand and collapse their content. Use it for FAQs, settings groups, and long reference content that readers scan before opening one part. For a single show-more toggle, use `Collapsible`.

```jsx
import { AccordionGroup, Icon, Pill } from '@gaudi/design-system';
import '@gaudi/design-system/global.css';

<AccordionGroup
  variant='separated'
  indicator='plus-minus'
  items={[
    {
      value: 'account',
      title: 'Account settings',
      description: 'Manage your profile and preferences.',
      leading: <Icon name='Settings' decorative />,
      badge: <Pill size='xs' variant='soft'>New</Pill>,
      content: <p>Account settings content.</p>
    }
  ]}
/>
```

### State and variants

- `type`: `single` (default) or `multiple`.
- `value` / `onValueChange`: controlled state. Single close emits `undefined`; multiple changes emit an array. Explicit `value={undefined}` keeps a controlled single root collapsed.
- `defaultValue`: initial uncontrolled state. A group opens the first enabled item by default, including as an array in multiple mode. Pass `null` (single) or `[]` (multiple) to start closed. `AccordionRoot` starts closed by default.
- `collapsible={false}`: keep the current single panel open until another is selected.
- `disabled`: disable all root items; item `disabled` disables a single trigger.
- `variant`: `outline` (default), `flush`, `separated`, `solid`, or `framed`.
- `indicator`: `chevron` (default), `plus-minus`, `arrow`, a React node, `({ isOpen }) => ReactNode`, or `null`. Override on an individual item/trigger.
- `indicatorPosition`: logical `start` or `end` (default). `dir='rtl'` sets both layout and navigation direction.
- `highlight`: accent background for an expanded header.
- `headingLevel`: 2–6; defaults to 3. Override at root, item, or trigger.

Give each item a unique, nonempty string `value`. An item's `title` and `content` accept React nodes. `leading`, `description`, and `badge` enrich the trigger. `className`, `triggerClassName`, and `contentClassName` customize each group item; native props and refs pass through the compound primitives. `AccordionContent` applies `className` to its padded inner body and its remaining native props/ref to the animated region.

### Composition

```jsx
import {
  AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent, Input
} from '@gaudi/design-system';

<AccordionRoot type='multiple' defaultValue={['profile']}>
  <AccordionItem value='profile'>
    <AccordionTrigger description='Drafts are kept when you close this section.'>
      Profile
    </AccordionTrigger>
    <AccordionContent forceMount>
      <label htmlFor='profile-name'>Display name</label>
      <Input id='profile-name' defaultValue='Amira' />
    </AccordionContent>
  </AccordionItem>
</AccordionRoot>
```

The package-root `Accordion` remains an alias for `AccordionGroup`. Use `AccordionRoot` for unambiguous compound composition. The existing named `Accordion` export from `@gaudi/design-system/core/Accordion` remains the compound root. Legacy render-function children receive `{ currentValue, setValue, type }`; explicit `isOpen`, `onClick`, `contentId`, `id`, and `labelledBy` wiring remains supported.

### Accessibility and content lifecycle

Each header is a native button inside a heading, with unique IDs associating the trigger and content. Header descriptions are separate accessible descriptions; decorative icons/avatars do not duplicate names. Choose heading levels to fit the page. Keep header slots noninteractive and place links, buttons, and form controls inside content.

Tab follows the normal document order. Enter/Space toggles a header. Arrow Up/Down navigates enabled headers with wrapping; Home/End moves to the first/last. Nested groups maintain separate navigation. Disabled items are skipped. Open/close height and indicator motion respects reduced-motion preferences.

Closed content is inert during its exit animation, then unmounted. `forceMount` retains content while hiding it visually and from keyboard/screen-reader navigation, preserving form drafts. Hidden retained inputs still participate in native form submission: applications own validation and submission scope. Avoid unnecessary region proliferation in very large multiple-open groups; set `role={undefined}` on compound content when appropriate.
