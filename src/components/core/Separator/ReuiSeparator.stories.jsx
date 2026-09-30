// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/separator/c-separator-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/separator/c-separator-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/separator/c-separator-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/separator/c-separator-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/separator/c-separator-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/separator/c-separator-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/separator/c-separator-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/separator/c-separator-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/separator/c-separator-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/separator/c-separator-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/separator/c-separator-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/separator/c-separator-6.jsx?raw';

export default {
  title: 'Core/Separator',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='separator'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Separator compositions owned by Gaudi Separator. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSeparator1 = {
  name: 'Horizontal separator for content sections.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Horizontal separator for content sections.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSeparator2 = {
  name: 'Vertical separator for inline elements.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Vertical separator for inline elements.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSeparator3 = {
  name: 'Vertical separator groups related menu items.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Vertical separator groups related menu items.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSeparator4 = {
  name: 'Horizontal separator between items in a list.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Horizontal separator between items in a list.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiSeparator5 = {
  name: 'Separator with centered text label',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Separator with centered text label' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiSeparator6 = {
  name: 'Order summary with separators',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Order summary with separators' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
