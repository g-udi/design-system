# Screens

> Blocks/Screens · blocks · `@gaudi/design-system/blocks/Screens`

Full-screen frames for sign-in, sign-up and onboarding: the main column beside an optional aside for imagery, quotes or logos, plus header and footer bands. Profile, settings, wizard, onboarding and auth examples compose it with AuthForm, Wizard and Core parts.

## Import

```js
import Screens from '@gaudi/design-system/blocks/Screens';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `Screen`, `ScreenTestimonial`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `aside` | `ReactNode` | — | no | Panel beside the main column; hidden below md so the form comes first on phones. |
| `asideSide` | `start \| end` | `end` | no | Which side the aside sits on from md up. |
| `asideClassName` | `string` | — | no | Classes for the aside panel, such as a surface or backdrop. |
| `header / footer` | `ReactNode` | — | no | Bands above and below the main column for a logo, account links, legal links or customer logos. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |
| `ScreenTestimonial.quotes` | `Array<{ quote, name, role, avatar? }>` | `[]` | no | Customer quotes; more than one rotates. |
| `ScreenTestimonial.rating / interval` | `number` | `— / 6000` | no | Optional star rating and rotation delay in milliseconds. |

## Variants

- `asideSide`: `start`, `end`

## Usage

```jsx
import { Screen } from '@gaudi/design-system/blocks/Screens';

<Screen>{pageContent}</Screen>
```

## Accessibility

The main column always renders first in reading order. Rotating quotes pause on hover, focus and reduced motion, and their dots are 24px targets that name each quote.

## Notes

- Screens frame flows the host owns; authentication, validation and saving stay in AuthForm, Wizard and the consuming app.

## Related

`blocks-profile`, `blocks-wizard`, `blocks-onboarding`, `blocks-settings`

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
