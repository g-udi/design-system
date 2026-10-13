import { p, className, definition } from '../../../../../docs/components/referenceProps.js';
export default {
  'Blocks/Marketing/Heroes': {
    ...definition('Responsive hero sections for product, editorial, and marketing pages. One shared layout owns the heading, introduction, action group, and media; compose the slots with existing Gaudi components.', [
      p('eyebrow', 'ReactNode', '—', 'Optional label, badge, or mark above the heading. It stays outside the heading so the section name is only the title.'),
      p('title', 'ReactNode', '—', 'The primary heading. Keep it concise and specific.'),
      p('description', 'ReactNode', '—', 'Supporting paragraph, rendered with Gaudi typography.'),
      p('layout', 'centered | split | editorial | background', 'centered', 'Centered stack, side-by-side image, editorial heading and introduction, or background image with an opaque readable content panel.'),
      p('actions', 'ReactNode', '—', 'Primary and secondary actions; use Button and Link. Long labels wrap.'),
      p('media', 'ReactNode', '—', 'Prepared image, video, or product preview. Background layout is intended for decorative imagery.'),
      p('children', 'ReactNode', '—', 'Optional supporting content below the actions.'),
      p('headingAs', 'h1 | h2 | h3', 'h1', 'Choose the heading level for its place in the page.'),
      className
    ], 'The section is labelled by its heading. Reading order is eyebrow, heading, description, actions, supporting content, then media. Images need meaningful alternative text, or empty alt text when decorative. Background imagery must be decorative and non-interactive.', [
      'The hero responds to its container, stacking split and editorial layouts below 48rem.',
      'Supply prepared content and real destinations. Navigation, forms, claims, and product behavior belong to the host.',
      'Animated examples reuse Gaudi backgrounds (Aurora, Grainient, Dark Veil, Floating Lines, Liquid Ether) and include a pause control; reduced motion stops them.',
      'The examples are original Gaudi compositions using local artwork; no Tailwind Plus source is included.'
    ]),
    usage: "import { Hero } from '@gaudi/design-system/blocks/Hero';\nimport Button from '@gaudi/design-system/core/Button';\n\n<Hero title='A good place to start.' description='Your content. Shared foundations.' actions={<Button href='/start'>Get started</Button>} />"
  }
};
