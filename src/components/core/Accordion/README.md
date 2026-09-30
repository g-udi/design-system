# Accordion

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

## State and variants

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

## Composition

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

## Accessibility and content lifecycle

Each header is a native button inside a heading, with unique IDs associating the trigger and content. Header descriptions are separate accessible descriptions; decorative icons/avatars do not duplicate names. Choose heading levels to fit the page. Keep header slots noninteractive and place links, buttons, and form controls inside content.

Tab follows the normal document order. Enter/Space toggles a header. Arrow Up/Down navigates enabled headers with wrapping; Home/End moves to the first/last. Nested groups maintain separate navigation. Disabled items are skipped. Open/close height and indicator motion respects reduced-motion preferences.

Closed content is inert during its exit animation, then unmounted. `forceMount` retains content while hiding it visually and from keyboard/screen-reader navigation, preserving form drafts. Hidden retained inputs still participate in native form submission: applications own validation and submission scope. Avoid unnecessary region proliferation in very large multiple-open groups; set `role={undefined}` on compound content when appropriate.
