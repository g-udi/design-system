// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/menubar/c-menubar-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/menubar/c-menubar-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/menubar/c-menubar-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/menubar/c-menubar-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/menubar/c-menubar-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/menubar/c-menubar-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/menubar/c-menubar-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/menubar/c-menubar-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/menubar/c-menubar-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/menubar/c-menubar-5.jsx?raw';

export default {
  title: 'Core/DropdownMenu',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='menubar'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Menubar compositions owned by Gaudi DropdownMenu. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiMenubar1 = {
  name: 'Menubar: Basic menubar.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic menubar.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiMenubar2 = {
  name: 'Menubar: Menubar with dropdown submenus.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Menubar with dropdown submenus.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiMenubar3 = {
  name: 'Menubar: Menubar with checkbox & radio items.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Menubar with checkbox & radio items.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiMenubar4 = {
  name: 'Menubar: Menubar with icons.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Menubar with icons.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiMenubar5 = {
  name: 'Menubar: Menubar for formatting and media.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Menubar for formatting and media.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
