# Avatar

Avatar now shares its image, fallback and badge primitives with the curated compositions. The existing component supports real identity, source and collaborator use cases; its previous label, tone, size and shape API remains available.

[Open Avatar Docs](http://localhost:6007/?path=/docs/core-avatar--docs) for **44 examples**: all 35 curated patterns, the existing initials/size/color recipes and six complete account, collaboration, recovery, presence and international-identity examples. Each preview includes public, copyable source.

Photo examples use fixed [Random User](https://randomuser.me/) portrait URLs with fictional demo identities. The same portraits appear in sizes, account menus, presence badges, reviewer rosters and other component examples. Initials, color surfaces, workspace marks and broken-image states remain explicit fallback demonstrations. These URLs are fixture data; applications supply their own `src`. See the [portrait reference](../../../../.storybook/fixtures/PORTRAITS.md).

```jsx
import { Avatar, AvatarGroup } from '@gaudi/design-system';

<Avatar
  name='Maya Chen'
  src={person.photoUrl}
  shape='circle'
  indicator={{ label: 'Online', tone: 'success' }}
/>

<AvatarGroup avatars={people} max={3} size='md' label='Review team' />
```

| Prop | Contract |
| --- | --- |
| `src` | Remote, local or data image URL. Pending, missing and failed images show fallback content; changing the source resets loading. |
| `name` / `label` | Name generates Unicode-aware initials from the first and last words; a single word uses up to two characters. Label preserves explicitly supplied initials. |
| `alt` | Overrides the accessible identity; `alt=''` makes the avatar decorative beside visible text. |
| `fallback` | Custom text or noninteractive artwork; `true` renders the guest silhouette. Empty names show `?`. |
| `size` | `2xs`, `xs`, `sm`, `md`, `lg`, `xl`: 16, 20, 32, 40, 56 and 80px. Existing sizes retain their dimensions. |
| `shape` | `square` (default), `circle`, `tile`. Image and fallback inherit the same shape. |
| `surface` | `solid` (default, selected tone), `tinted`, `plain` or `bare`. Plain/bare default to `contain`; solid/tinted use `cover`. |
| `tone` | Existing gray, neutral, blue, teal, green, amber, yellow, red, rose and indigo colors. |
| `fit` / `grayscale` | Image crop (`cover` or `contain`) and optional grayscale treatment. |
| `indicator` | `{ label, tone?, icon?, position?, className? }`. Label is required; status is always supplied by the application. |
| `children` | Additional noninteractive `AvatarBadge` content. Provide its meaning in the root `aria-label`. |
| `onLoadingStatusChange` | Receives `loading`, `loaded` or `error` for host-owned feedback. |
| `imageProps`, `imageClassName`, `fallbackClassName` | Native image attributes and per-layer appearance. Identity alt text is owned by the root. |
| `ref`, native attributes | Forwarded to the root span. Wrap Avatar in Button, Tooltip or DropdownMenu for interaction. |

Indicators support `success`, `warning`, `danger`, `neutral` and `primary`, and `top-start`, `top-end`, `bottom-start`, `bottom-end` positions. Logical positions follow reading direction. Presence remains separate from loading or failure. The face retains its rounded crop while badges remain outside its bounds.

## Groups

`AvatarGroup` continues to accept compound children. Pass `avatars` for data-driven composition: each entry contains a unique stable `id` plus Avatar props. `max` defaults to four; positive fractions round down to at least one, and zero/negative/non-finite values show all. Empty lists have no overflow count. Supply surrounding empty-state copy where appropriate.

`size`, `shape` and `label` apply to the group. `renderAvatar(avatar, person)` and `renderOverflow(count, overflow)` wrap the supplied elements with existing buttons, tooltips or dialogs. `formatOverflow(count)` supplies translated overflow text. Large groups scroll within their own bounds. Compound APIs remain available as `AvatarRoot`, `AvatarImage`, `AvatarFallback`, `AvatarBadge` and `AvatarGroupCount` from this owner and the package root.

## Composition compatibility

The 35 patterns cover images and fallbacks, standard/custom sizes and radii, rings, status and icon badges in every corner, counts, team stacks, profile text, grayscale, social proof, buttons, hover tooltips, empty states, loading, animated rings, multiple badges and account menus. They all appear on the main docs page. Motion examples respect reduced-motion preferences.

Tests cover accessible and decorative identities, Unicode initials, empty and limited groups, source failure/recovery/removal, account actions, roster focus return, legacy consumers and responsive layouts. Apps own identity data, presence, translations, permissions, networking and persistence.

See [Pattern coverage](../../../../REUI-COVERAGE.md) and [source notices](../../../../THIRD_PARTY_NOTICES.md).
