import { Page, Section } from '../components/StoryDocs';
import { GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';

export default {
  id: 'overview-landing',
  title: 'Landing',
  tags: [ 'dev', '!autodocs' ],
  parameters: { layout: 'fullscreen' }
};

export const Landing = {
  name: 'Landing',
  render: () => (
    <Page compact title={<GaudiBrand className='text-inherit' />} intro='A curated design system for blogs and applications. Shared foundations, rich components, and practical patterns for reuse across products.'>
      <nav aria-label='Explore Gaudi' className='gaudi-guide-links'>
        <a href='./?path=/story/overview-component-catalogue--browse' target='_top'><strong>Component Catalogue</strong><span>Find a component, explore its examples, and use it in your project.</span></a>
        <a href='./?path=/story/overview-getting-started--default' target='_top'><strong>Getting Started</strong><span>Install the package and build your first interface.</span></a>
        <a href='./?path=/story/overview-essentials--essentials' target='_top'><strong>Essentials</strong><span>Tokens, typography, icons, states, and accessibility.</span></a>
      </nav>
      <Section title='Curated for reuse' description='Useful patterns become part of one coherent system. When a component already fits, extend it with the missing variants and use cases. Add a new component when there is a distinct gap.' />
    </Page>
  )
};
