# Footers

> Blocks/Marketing/Footers · layout · `@gaudi/design-system/layout/Footer`

Site footer with host-supplied navigation, social links, copyright, and optional newsletter form.

## Import

```js
import Footers from '@gaudi/design-system/layout/Footer';
// also: import { … } from '@gaudi/design-system/layout';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `standard \| editorial \| centered \| compact` | `standard` | no | Link columns with a newsletter, blog branding, centered navigation, or compact inline navigation. |
| `sections` | `Array<{ title, links: Array<{ href, label }> }>` | `[]` | no | Navigation groups from the host. |
| `socialLinks` | `Array<{ kind, href }>` | `[]` | no | Social destinations; missing URLs are omitted. |
| `copyrightName` | `string \| { name?, author? }` | — | no | Host-owned attribution. |
| `brandTitle` | `ReactNode` | — | no | Host-supplied name or brand component. |
| `brandDescription` | `string` | — | no | Short description beneath the brand. |
| `className` | `string` | — | no | Additional classes on the footer landmark. |
| `newsletterProps` | `NewsletterForm props` | — | no | Explicit endpoint and subscription copy. |

## Variants

- `variant`: `standard`, `editorial`, `centered`, `compact`

## Usage

```jsx
import Footer from '@gaudi/design-system/layout/Footer';

<Footer sections={footerLinks} copyrightName='Example Studio' newsletterProps={{ endpoint: '/api/subscribe' }} />
```

## Accessibility

Retains the footer landmark and uniquely named navigation regions. Supply descriptive link labels and a configured newsletter endpoint before allowing subscription.

## Examples

- Blog with link columns (Storybook `layout-footer--blog`)
- With newsletter (Storybook `layout-footer--newsletter`)
- Centered (Storybook `layout-footer--centered`)
- Compact inline (Storybook `layout-footer--compact`)
- Newsletter unavailable (Storybook `layout-components--footer-layout`)
- Newsletter error (Storybook `layout-footer--submission-error`)

## Related

`core-link`, `blocks-navigation`

## README

One footer owner for blog and marketing pages. Import from `@gaudi/design-system/layout/Footer`.

- `standard` places navigation beside the shared `NewsletterForm`.
- `editorial` places a brand and social links beside grouped navigation.
- `centered` centers the brand, a flat list of links, social links, and copyright.
- `compact` puts the brand, flat navigation, and social links in a row when the container permits.

Supply `sections` as `{ title, links: [{ href, label }] }[]`, `socialLinks` as `{ kind, href }[]`, and `copyrightName` as a name or author object. Content and destinations belong to the host. Empty navigation and social groups are omitted. The simple variants flatten the supplied navigation groups.

`brandTitle` accepts a React node, including `GaudiBrand`; `brandDescription` supplies the supporting text. `className` and native footer attributes pass through to the landmark. Each instance generates a unique accessible heading.

`newsletterProps` goes to `NewsletterForm`. An endpoint is required to enable subscriptions; the examples use local sample responses and never subscribe an address. Custom form classes merge with the footer defaults.

The footer responds to its container, so it can be used in page layouts and inset regions. The host owns the outer width and horizontal gutters. Keep each page's footer outside its main landmark.
