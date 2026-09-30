// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/navigation-menu/c-navigation-menu-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/navigation-menu/c-navigation-menu-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/navigation-menu/c-navigation-menu-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/navigation-menu/c-navigation-menu-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/navigation-menu/c-navigation-menu-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/navigation-menu/c-navigation-menu-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/navigation-menu/c-navigation-menu-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/navigation-menu/c-navigation-menu-4.jsx?raw';

export default {
  title: 'Blocks/Navigation/Navigation Menu',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='navigation-menu'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Navigation Menu compositions owned by Gaudi NavigationMenu. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiNavigationMenu1 = {
  name: 'Basic navigation menu.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic navigation menu.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiNavigationMenu2 = {
  name: 'Navigation menu with grid layout.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Navigation menu with grid layout.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiNavigationMenu3 = {
  name: 'Navigation menu with icons.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Navigation menu with icons.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiNavigationMenu4 = {
  name: 'Navigation menu with grid layout and learn more button.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: {
        story: 'Navigation menu with grid layout and learn more button.'
      },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
