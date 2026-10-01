# Screens

Full-screen frames for sign-in, sign-up and onboarding. `Screen` puts the main column (an AuthForm, Wizard or settings panel) beside an optional `aside` for imagery, customer quotes or logos, with `header` and `footer` bands. `ScreenTestimonial` rotates customer quotes in an aside. The catalogue also collects composed profile, settings, wizard, onboarding and auth screens built from AuthForm, Wizard and Core parts.

## Usage

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

## API

| Prop / export                         | Type                              | Contract                                                                  |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `aside`                               | ReactNode                         | Panel beside the main column; hidden below md so the form comes first.    |
| `asideSide`                           | start or end                      | Side of the aside from md up. The main column stays first in source.      |
| `asideClassName / className`          | string                            | Classes for the aside panel and the frame.                                |
| `header / footer`                     | ReactNode                         | Bands for a logo, account links, legal links or customer logos.           |
| `ScreenTestimonial.quotes`            | {quote, name, role, avatar?}[]    | Customer quotes; more than one rotates and shows named dots.              |
| `ScreenTestimonial.rating / interval` | number                            | Optional star rating and rotation delay (6000 ms by default).             |

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence; authentication and validation stay in AuthForm, Wizard and the consuming app. Rotation pauses on hover, focus and reduced motion. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
