# Footer

> Layout/Footer · layout · `@gaudi/design-system/layout/Footer`

Site footer with host-supplied navigation, social links, copyright, and optional newsletter form.

## Import

```js
import Footer from '@gaudi/design-system/layout/Footer';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `standard \| editorial` | `standard` | no | Newsletter layout or brand-led layout. |
| `sections` | `Array<{ title, links: Array<{ href, label }> }>` | `[]` | no | Navigation groups from the host. |
| `socialLinks` | `Array<{ kind, href }>` | `[]` | no | Social destinations; missing URLs are omitted. |
| `copyrightName` | `string \| { name?, author? }` | — | no | Host-owned attribution. |
| `brandTitle / brandDescription` | `string` | — | no | Editorial brand heading and description. |
| `newsletterProps` | `NewsletterForm props` | — | no | Explicit endpoint and subscription copy. |

## Variants

- `variant`: `standard`, `editorial`

## Usage

```jsx
import Footer from '@gaudi/design-system/layout/Footer';

<Footer sections={footerLinks} copyrightName='Example Studio' newsletterProps={{ endpoint: '/api/subscribe' }} />
```

## Accessibility

Retains the footer landmark and uniquely named navigation regions. Supply descriptive link labels and a configured newsletter endpoint before allowing subscription.

## Examples

- Footer (Storybook `layout-components--footer-layout`)

## Related

`blocks-navigation`
