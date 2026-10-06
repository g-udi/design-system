# Onboarding

> Blocks/Onboarding · blocks · `@gaudi/design-system/blocks/Screens`

First-run flows: workspace setup, a publication with a progress rail, a product tour in a dialog and connecting a coding agent.

## Import

```js
import Onboarding from '@gaudi/design-system/blocks/Screens';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `Screen`, `ScreenTestimonial`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `Wizard` | `Blocks/Wizard` | — | no | Steps, validation and progress for multi-step setup. |
| `Field / RadioGroup / ToggleGroup / Switch` | `Core form parts` | — | no | Choices for each step with visible labels. |
| `Dialog / Carousel` | `Core overlays` | — | no | Tours that walk through features one slide at a time. |
| `EmptyState / CodeBlock / Kbd` | `Core display` | — | no | First-run guidance, install commands and shortcuts. |

## Usage

```jsx
import Wizard from '@gaudi/design-system/blocks/Wizard';

<Wizard title='Set up your workspace' steps={steps} onComplete={createWorkspace}>
  {stepIndex => panels[steps[stepIndex].id]}
</Wizard>
```

## Accessibility

Let people skip or come back to optional steps, keep focus on the step heading when it changes, and never trap focus outside a dialog tour.

## Examples

Curated patterns:

- Connect a coding agent — registry item `@gaudi/screens-coding-agent` (uses `Button`, `CheckboxRoot`, `ClaudeAiIcon`, `CodeBlock`, `CursorLight`, `EmailInput`, `Field`, `FieldError`, `FieldLabel`, `Gemini`, `Input`, `Label`, `Openai`, `RadioGroup`, `RegistryIcon`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `Wizard`, `cn`)
- Tour in a dialog — registry item `@gaudi/screens-dialog-tour` (uses `Button`, `DialogContent`, `DialogDescription`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `EmptyState`, `KbdGroup`, `KbdRoot`, `Label`, `RadioGroup`, `RegistryIcon`, `SwitchRoot`, `Wizard`)
- Create a publication — registry item `@gaudi/screens-new-publication` (uses `Button`, `CarouselContent`, `CarouselItem`, `CarouselRoot`, `EmptyState`, `Field`, `FieldError`, `FieldLabel`, `Input`, `Label`, `RadioGroup`, `RegistryIcon`, `SwitchRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `Wizard`, `cn`)
- Workspace setup — registry item `@gaudi/screens-workspace-setup` (uses `AvatarFallback`, `AvatarRoot`, `Badge`, `Discord`, `Dropbox`, `Field`, `FieldDescription`, `FieldError`, `FieldLabel`, `GoogleDrive`, `Input`, `Loom`, `RadioGroup`, `RegistryIcon`, `Slack`, `Textarea`, `ToggleGroupItem`, `ToggleGroupRoot`, `Wizard`, `Zoom`)

## Related

`blocks-profile`, `blocks-settings`, `blocks-screens`

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
