# Settings

> Blocks/Settings · blocks · `@gaudi/design-system/blocks/Screens`

Settings pages: preferences in collapsible sections, notification channels, integrations with connect toggles, and developer keys and webhooks.

## Import

```js
import Settings from '@gaudi/design-system/blocks/Screens';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `Screen`, `ScreenTestimonial`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `Accordion / Tabs` | `Core navigation` | — | no | Group related settings; sections stay reachable by keyboard. |
| `Switch / Checkbox / Select / ToggleGroup` | `Core form parts` | — | no | One control per row with its label and help text. |
| `Banner / Pill` | `Status` | — | no | Plan badges, integration status and webhook health. |
| `CodeBlock` | `Core display` | — | no | Copyable keys, endpoints and payload samples. |

## Usage

```jsx
import { Screen } from '@gaudi/design-system/blocks/Screens';
import Button from '@gaudi/design-system/core/Button';

<Screen>
  <h1>Account settings</h1>
  <form onSubmit={saveSettings}>
    {settingsFields}
    <Button type='submit'>Save settings</Button>
  </form>
</Screen>
```

## Accessibility

Pair every switch with a visible label and description, and confirm destructive actions such as revoking a key.

## Examples

Curated patterns:

- Developer — registry item `@gaudi/screens-developer` (uses `Alert`, `AlertAction`, `AlertDescription`, `AlertTitle`, `Badge`, `Button`, `CodeBlockGroup`, `Label`, `RegistryIcon`, `SwitchRoot`, `TableBodyPrimitive`, `TableCaption`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `useCopyToClipboard`)
- Integrations — registry item `@gaudi/screens-integrations` (uses `Badge`, `Button`, `Discord`, `Dropbox`, `GoogleDrive`, `Loom`, `Slack`, `Stripe`, `Supabase`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `Zoom`)
- Notifications — registry item `@gaudi/screens-notifications` (uses `CheckboxRoot`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `Label`, `NativeSelect`, `NativeSelectOption`, `RegistryIcon`, `SwitchRoot`, `TableBodyPrimitive`, `TableCaption`, `TableCellPrimitive`, `TableHeadPrimitive`, `TableHeader`, `TableRoot`, `TableRowPrimitive`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `ToggleGroupItem`, `ToggleGroupRoot`)
- Preferences — registry item `@gaudi/screens-preferences` (uses `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `FieldContent`, `FieldDescriptionPrimitive`, `FieldLabelPrimitive`, `FieldRoot`, `NativeSelect`, `NativeSelectOption`, `RegistryIcon`, `SwitchRoot`)

## Related

`blocks-onboarding`, `blocks-profile`, `blocks-screens`

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
