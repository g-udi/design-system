# Heroes

> Blocks/Marketing/Heroes · blocks · `@gaudi/design-system/blocks/Hero`

Responsive hero sections for product, editorial, and marketing pages. One shared layout owns the heading, introduction, action group, and media; compose the slots with existing Gaudi components.

## Import

```js
import Heroes from '@gaudi/design-system/blocks/Hero';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `Hero`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `eyebrow` | `ReactNode` | — | no | Optional label, badge, or mark above the heading. It stays outside the heading so the section name is only the title. |
| `title` | `ReactNode` | — | no | The primary heading. Keep it concise and specific. |
| `description` | `ReactNode` | — | no | Supporting paragraph, rendered with Gaudi typography. |
| `layout` | `centered \| split \| editorial \| background` | `centered` | no | Centered stack, side-by-side image, editorial heading and introduction, or background image with an opaque readable content panel. |
| `actions` | `ReactNode` | — | no | Primary and secondary actions; use Button and Link. Long labels wrap. |
| `media` | `ReactNode` | — | no | Prepared image, video, or product preview. Background layout is intended for decorative imagery. |
| `children` | `ReactNode` | — | no | Optional supporting content below the actions. |
| `headingAs` | `h1 \| h2 \| h3` | `h1` | no | Choose the heading level for its place in the page. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `layout`: `centered`, `split`, `editorial`, `background`
- `headingAs`: `h1`, `h2`, `h3`

## Usage

```jsx
import { Hero } from '@gaudi/design-system/blocks/Hero';
import Button from '@gaudi/design-system/core/Button';

<Hero title='A good place to start.' description='Your content. Shared foundations.' actions={<Button href='/start'>Get started</Button>} />
```

## Accessibility

The section is labelled by its heading. Reading order is eyebrow, heading, description, actions, supporting content, then media. Images need meaningful alternative text, or empty alt text when decorative. Background imagery must be decorative and non-interactive.

## Notes

- The hero responds to its container, stacking split and editorial layouts below 48rem.
- Supply prepared content and real destinations. Navigation, forms, claims, and product behavior belong to the host.
- Animated examples reuse Gaudi backgrounds (Aurora, Grainient, Dark Veil, Floating Lines, Liquid Ether) and include a pause control; reduced motion stops them.
- The examples are original Gaudi compositions using local artwork; no Tailwind Plus source is included.

## Examples

- Aurora (Storybook `blocks-marketing-heroes--playground`)
- Mesh gradient (Storybook `blocks-marketing-heroes--mesh-gradient`)
- Live surface (Storybook `blocks-marketing-heroes--live-surface`)
- Journal topics (Storybook `blocks-marketing-heroes--journal-topics`)
- Split image (Storybook `blocks-marketing-heroes--split-image`)
- Product preview (Storybook `blocks-marketing-heroes--product-preview`)
- Editorial (Storybook `blocks-marketing-heroes--editorial`)

## Related

`blocks-navigation`, `animations-backgrounds-aurora`, `animations-backgrounds-grainient`, `core-button`, `core-link`

## README

A responsive marketing introduction, showcased in **Blocks → Marketing → Heroes**.

```jsx
import { Hero } from '@gaudi/design-system/blocks/Hero';
import Button from '@gaudi/design-system/core/Button';

<Hero
  layout='split'
  title='A good place to start.'
  description='Your content. Shared foundations.'
  actions={<Button href='/start'>Get started</Button>}
  media={<img src='/cover.jpg' alt='Your image description' />}
/>
```

`layout` supports `centered`, `split`, `editorial`, and `background`. Split and editorial layouts stack below a 48rem container width. With no media, split keeps a single content column. Slots accept existing Gaudi components; the block does not own navigation, forms, destinations, or product data. `eyebrow` places a short label, Badge, or mark above the heading without changing the section name. `children` adds supporting content below the actions.

The section labels itself with its heading. Use `headingAs` to fit the document hierarchy. Supply decorative, non-interactive media for `background`; its opaque content panel keeps text readable in both themes. Images require descriptive alt text unless decorative. Button and Link provide the action semantics, focus, and keyboard behavior.

For an animated hero, place the Hero inside a Gaudi background such as `Borealis` or `Grainient`, give the Hero `className='bg-transparent'`, and offer a pause control. Use the dark theme scope for dark effects so text keeps its contrast.
