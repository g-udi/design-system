// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/hover-card/c-hover-card-8.jsx?raw';

export default {
  title: 'Core/Popover',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='hover-card'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Hover Card compositions owned by Gaudi Popover. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiHoverCard1 = {
  name: 'Hover Card: Basic hover card.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic hover card.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiHoverCard2 = {
  name: 'Hover Card: Hover card with positions.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Hover card with positions.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiHoverCard3 = {
  name: 'Hover Card: Hover card with profile information.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Hover card with profile information.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiHoverCard4 = {
  name: 'Hover Card: Hover card with icon',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Hover card with icon' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiHoverCard5 = {
  name: 'Hover Card: Hover card with an image and text content.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Hover card with an image and text content.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiHoverCard6 = {
  name: 'Hover Card: Hover card inside a dialog.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Hover card inside a dialog.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiHoverCard7 = {
  name: 'Hover Card: Timestamp hover card with active relative time',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Timestamp hover card with active relative time' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiHoverCard8 = {
  name: 'Hover Card: Hover card with paginated release notes',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Hover card with paginated release notes' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
