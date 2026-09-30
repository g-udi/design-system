// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/accordion/c-accordion-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/accordion/c-accordion-11.jsx?raw';

export default {
  title: 'Core/Accordion',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='accordion'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Accordion compositions owned by Gaudi Accordion. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiAccordion1 = {
  name: 'A basic single-expand accordion',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'A basic single-expand accordion' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiAccordion2 = {
  name: 'Accordion with plus/minus indicators',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Accordion with plus/minus indicators' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiAccordion3 = {
  name: 'Accordion with borders and rounded corners',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Accordion with borders and rounded corners' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiAccordion4 = {
  name: 'Accordion embedded within a Card',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Accordion embedded within a Card' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiAccordion5 = {
  name: 'Accordion with disabled items and highlighted state',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story: 'Accordion with disabled items and highlighted state'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiAccordion6 = {
  name: 'Advanced accordion with custom icons and badges',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Advanced accordion with custom icons and badges' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiAccordion7 = {
  name: 'Accordion items integrated within Frame and FramePanel',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: {
        story: 'Accordion items integrated within Frame and FramePanel'
      },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiAccordion8 = {
  name: 'Nested accordion example with bordered items',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Nested accordion example with bordered items' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiAccordion9 = {
  name: 'User list accordion with avatars and role indicators',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: {
        story: 'User list accordion with avatars and role indicators'
      },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiAccordion10 = {
  name: 'Accordion with rotating arrow indicator',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Accordion with rotating arrow indicator' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiAccordion11 = {
  name: 'Accordion pattern for onboarding or setup steps with icons, badges, and QR codes',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: {
        story:
          'Accordion pattern for onboarding or setup steps with icons, badges, and QR codes'
      },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
