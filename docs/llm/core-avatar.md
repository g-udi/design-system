# Avatar

> Core/Avatar · core · `@gaudi/design-system/core/Avatar`

Profile images, resilient initials, presence, verification, account menus and collaborator groups. The existing Avatar API and curated patterns share the same image and fallback primitives.

## Import

```js
import Avatar from '@gaudi/design-system/core/Avatar';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Avatar`, `AvatarBadge`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `avatarVariants`, `default`, `getAvatarInitials`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | — | no | Remote, local or data image source; failed and pending images show the fallback. |
| `name / label` | `string` | — | no | Name generates Unicode initials; label preserves explicit legacy initials. |
| `alt` | `string` | — | no | Accessible identity override; an empty string is decorative. |
| `fallback` | `ReactNode \| boolean` | `initials` | no | Custom artwork or text; true shows the guest silhouette. |
| `size` | `2xs \| xs \| sm \| md \| lg \| xl` | `md` | no | Six sizes; existing xs through lg dimensions are preserved. |
| `shape` | `circle \| square \| tile` | `square` | no | Identity crop and background treatment. |
| `surface` | `solid \| tinted \| plain \| bare` | `solid` | no | Identity crop and background treatment. |
| `indicator` | `{ label, tone?, icon?, position? }` | — | no | Host-provided presence or verification; positions follow reading direction. |
| `imageProps` | `object` | — | no | Image attributes and per-layer appearance. |
| `imageClassName` | `string` | — | no | Image attributes and per-layer appearance. |
| `fallbackClassName` | `string` | — | no | Image attributes and per-layer appearance. |
| `tone` | `gray \| neutral \| blue \| teal \| green \| amber \| yellow \| red \| rose \| indigo` | `gray` | no | Fallback colour family. |
| `grayscale` | `boolean` | `false` | no | Desaturates the image. |
| `onLoadingStatusChange` | `(status) => void` | — | no | Receives loading, loaded or error; source changes recover automatically. |
| `AvatarGroup` | `avatars, max, size, shape, label, renderAvatar, renderOverflow` | — | no | Accepts data-driven identities or existing compound children. |

## Variants

- `size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`
- `shape`: `circle`, `square`, `tile`
- `surface`: `solid`, `tinted`, `plain`, `bare`
- `tone`: `gray`, `neutral`, `blue`, `teal`, `green`, `amber`, `yellow`, `red`, `rose`, `indigo`

## Usage

```jsx
import { Avatar } from '@gaudi/design-system';

<Avatar name='Mei Castellanos' src='/avatars/person-20.svg' shape='circle' indicator={{ label: 'Online', tone: 'success' }} />
```

## Accessibility

A named Avatar exposes one image label, including host-provided presence. Use alt="" beside visible identity text. Wrap interactive avatars in Button, Tooltip or DropdownMenu; status badges never infer presence from image loading.

## Examples

- Playground (Storybook `core-avatar--playground`)
- Indicators (Storybook `core-avatar--indicators`)
- Fallbacks (Storybook `core-avatar--fallbacks`)
- Image Recovery (Storybook `core-avatar--image-recovery`)
- Group Overflow (Storybook `core-avatar--group-overflow`)

Curated patterns:

- Account dropdown menu — registry item `@gaudi/avatar-account-menu` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `RegistryIcon`)
- Rings and activity — registry item `@gaudi/avatar-activity-rings` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `LoaderRoot`)
- Empty state — registry item `@gaudi/avatar-empty-state` (uses `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `RegistryIcon`)
- Groups — registry item `@gaudi/avatar-groups` (uses `AvatarBadge`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `Button`, `RegistryIcon`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Hover groups with tooltips — registry item `@gaudi/avatar-hover-groups` (uses `Avatar`, `TooltipContent`, `TooltipProvider`, `TooltipRoot`, `TooltipTrigger`)
- Inside buttons — registry item `@gaudi/avatar-in-buttons` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`)
- Sizes, shapes and fallbacks — registry item `@gaudi/avatar-sizes-fallbacks` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `RegistryIcon`)
- Social proof — registry item `@gaudi/avatar-social-proof` (uses `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Frame`, `FramePanel`)
- Status and icon badges — registry item `@gaudi/avatar-status-badges` (uses `AvatarBadge`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `RegistryIcon`)
- User details and badge — registry item `@gaudi/avatar-user-details` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`)

## Related

`blocks-profile`, `core-button`, `core-tooltip`, `core-dropdownmenu`, `mdx-image`

## README

A person, workspace or source shown as a photo, initials or an icon, with an optional presence badge. `Avatar` and `AvatarGroup` are built on the `AvatarRoot`, `AvatarImage`, `AvatarFallback` and `AvatarBadge` parts.

Image examples use Gaudi's own illustrated avatars bundled with Storybook (`/avatars/person-20.svg`, generated deterministically from a seed) with fictional demo identities, so examples never load images from the network. The same avatars appear in sizes, account menus, presence badges, reviewer rosters and other component examples. Initials, color surfaces, workspace marks and broken-image states remain explicit fallback demonstrations. These URLs are fixture data; applications supply their own `src`. See the [portrait reference](../../../../.storybook/public/avatars/README.md).

```jsx
import { Avatar, AvatarGroup } from '@gaudi/design-system';

<Avatar
  name='Mei Castellanos'
  src={person.photoUrl}
  shape='circle'
  indicator={{ label: 'Online', tone: 'success' }}
/>

<AvatarGroup avatars={people} max={3} size='md' label='Review team' />
```

| Prop | Contract |
| --- | --- |
| `src` | Remote, local or data image URL. Pending, missing and failed images show fallback content; changing the source resets loading. |
| `name` / `label` | Name generates Unicode-aware initials from the first and last words; a single word uses up to two characters. The 16px `2xs` size shows only the first initial so it stays legible at the `text-xs` step. Label preserves explicitly supplied initials. |
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

### Groups

`AvatarGroup` continues to accept compound children. Pass `avatars` for data-driven composition: each entry contains a unique stable `id` plus Avatar props. `max` defaults to four; positive fractions round down to at least one, and zero/negative/non-finite values show all. Empty lists have no overflow count. Supply surrounding empty-state copy where appropriate.

`size`, `shape` and `label` apply to the group. `renderAvatar(avatar, person)` and `renderOverflow(count, overflow)` wrap the supplied elements with existing buttons, tooltips or dialogs. `formatOverflow(count)` supplies translated overflow text. Large groups scroll within their own bounds. Compound APIs remain available as `AvatarRoot`, `AvatarImage`, `AvatarFallback`, `AvatarBadge` and `AvatarGroupCount` from this owner and the package root.
