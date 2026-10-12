# Profile

> Blocks/Profile · blocks · `@gaudi/design-system/blocks/Screens`

Account and organisation pages for an application: profile details, organisation members and permissions, billing and usage, referrals, and connected mailboxes.

## Import

```js
import Profile from '@gaudi/design-system/blocks/Screens';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `Screen`, `ScreenTestimonial`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `Tabs / Accordion` | `Core navigation` | — | no | Switch between profile panels; collapsible groups on narrow layouts. |
| `Field / Input / Select / Switch` | `Core form parts` | — | no | Editable profile and organisation settings with visible labels. |
| `Avatar / Pill / FileUpload` | `Core display parts` | — | no | People, roles, statuses and the profile photo upload. |
| `Progress / StatCard` | `Usage meters` | — | no | Plan usage, quotas and referral tiers. |

## Usage

```jsx
import { Screen } from '@gaudi/design-system/blocks/Screens';
import Avatar from '@gaudi/design-system/core/Avatar';

<Screen>
  <Avatar src={person.avatar} name={person.name} />
  <h1>{person.name}</h1>
  {profileContent}
</Screen>
```

## Accessibility

Each panel keeps one heading level, labels every control, and announces saved or failed changes next to the form.

## Examples

Curated patterns:

- Account settings — registry item `@gaudi/screens-account-settings` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `EmailInput`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `Input`, `NativeSelect`, `NativeSelectOption`, `RegistryIcon`, `Separator`, `SwitchRoot`, `cn`, `useFileUpload`)
- Billing — registry item `@gaudi/screens-billing` (uses `Badge`, `Button`, `ProgressRoot`, `RegistryIcon`, `StatCard`, `TableBodyPrimitive`, `TableCaption`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`)
- Inbox and meeting capture — registry item `@gaudi/screens-inbox-capture` (uses `Badge`, `Button`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldGroup`, `FieldLabelPrimitive`, `FieldRoot`, `FieldSeparator`, `Label`, `NativeSelect`, `NativeSelectOption`, `RadioGroupItem`, `RadioGroupRoot`, `RegistryIcon`, `SwitchRoot`, `Textarea`)
- Organisation tabs — registry item `@gaudi/screens-organisation-tabs` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `Input`, `Label`, `RegistryIcon`, `SwitchRoot`, `TableBodyPrimitive`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Referral rewards — registry item `@gaudi/screens-referral-rewards` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `ProgressRoot`, `RegistryIcon`, `cn`, `useCopyToClipboard`)

## Related

`core-switch`, `blocks-onboarding`, `blocks-settings`, `blocks-screens`

## README

Full-screen frames for sign-in, sign-up and onboarding. `Screen` puts the main column (an AuthForm, Wizard or settings panel) beside an optional `aside` for imagery, customer quotes or logos, with `header` and `footer` bands. `ScreenTestimonial` rotates customer quotes in an aside. The catalogue also collects composed profile, settings, wizard, onboarding and auth screens built from AuthForm, Wizard and Core parts.

### Usage

```jsx
import { AuthForm } from '@gaudi/design-system/blocks/AuthForm';
import { Screen, ScreenTestimonial } from '@gaudi/design-system/blocks/Screens';

<Screen
  aside={<ScreenTestimonial quotes={quotes} rating={4.8} className='p-10' />}
  asideSide='start'
  header={<Logo />}
  footer={<LegalLinks />}
>
  <AuthForm onSubmit={signIn} />
</Screen>;
```

### API

| Prop / export                         | Type                              | Contract                                                                  |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `aside`                               | ReactNode                         | Panel beside the main column; hidden below md so the form comes first.    |
| `asideSide`                           | start or end                      | Side of the aside from md up. The main column stays first in source.      |
| `asideClassName / className`          | string                            | Classes for the aside panel and the frame.                                |
| `header / footer`                     | ReactNode                         | Bands for a logo, account links, legal links or customer logos.           |
| `ScreenTestimonial.quotes`            | {quote, name, role, avatar?}[]    | Customer quotes; more than one rotates and shows named dots.              |
| `ScreenTestimonial.rating / interval` | number                            | Optional star rating and rotation delay (6000 ms by default).             |

### Ownership and verification

The host supplies data, translations, network calls, permissions and persistence; authentication and validation stay in AuthForm, Wizard and the consuming app. Rotation pauses on hover, focus and reduced motion. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
