# Accordion

Accessible disclosure with controlled or uncontrolled state, single or multiple expansion, and rich application content. Styling uses Gaudi tokens in both themes; the behavior uses Radix Accordion.

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

## Pattern coverage

Eleven accordion patterns are available together in **Core / Accordion / Pattern Overview** and individually with source code.

| Pattern | Gaudi story / API |
| --- | --- |
| Basic single expansion | Basic Disclosure · `variant='flush'` |
| Plus / minus indicators | Plus Minus · `indicator='plus-minus'` |
| Individually bordered items | Bordered Items · `variant='separated'` |
| Embedded in a Card | Inside Card · existing Card and panel actions |
| Disabled items, highlighted state | Disabled And Highlighted · item `disabled`, root `highlight` |
| Custom icons and badges | Icons And Badges · `leading`, `badge` |
| Frame / FramePanel | Framed Panels · `variant='framed'` |
| Nested bordered accordions | Nested Sections · independent roots and heading levels |
| User list with avatars and roles | Member Directory · existing Avatar and Pill, `description` |
| Rotating leading arrow | Leading Arrow · `indicator='arrow'`, `indicatorPosition='start'` |
| Onboarding with icons, badges, QR, and form | Guided Setup · controlled group, Progress, real QR link, dependent steps |

Gaudi adapts these use cases to its own component API and visual identity. It reuses the existing Card, Avatar, Pill, and Frame components. The setup fixture is illustrative: its QR encodes the public package repository; the form saves in local React state. Applications provide their own URLs, requests, and persistence.

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

## Verification

The stories cover all eleven patterns plus legacy composition, controlled clearing, multiple defaults, keyboard navigation, nested focus isolation, disabled sections, retained forms, RTL, and non-collapsible groups. Server-render contracts verify initial state, stable ARIA associations, rich composition, controlled emptiness, retained markup, and disabled roots.

Verified on 29 September 2026:

- 23 Accordion Storybook interaction and axe tests passed; the complete suite passed 277 tests across 109 story files.
- All 51 repository contract tests, lint, and `git diff --check` passed.
- The eleven-pattern gallery was checked in light and dark at 320, 390, 639, 640, 641, 768, 1023, 1024, 1025, 1280, 1536, and 1920 CSS pixels (900px height), including adjacent widths at its 640px and 1024px breakpoints. No page overflow, clipped headers/content, or overlapping example sections remained.
- Basic/nested interactions and disabled states were exercised at 320, 768, and 1536px; setup submission and focus transfer at 320px. RTL was checked at 320, 768, and 1536px. Solid/custom indicators were checked at all twelve widths.
- The visual pass fixed a card-height overlap and the Storybook image-import shape. Temporary viewport and theme overrides were restored.
