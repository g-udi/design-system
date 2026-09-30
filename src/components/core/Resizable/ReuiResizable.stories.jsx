// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/resizable/c-resizable-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/resizable/c-resizable-10.jsx?raw';

export default {
  title: 'Core/Resizable',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='resizable'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Resizable compositions owned by Gaudi Resizable. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiResizable1 = {
  name: 'Horizontal resizable layout',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Horizontal resizable layout' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiResizable2 = {
  name: 'Vertical resizable layout.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Vertical resizable layout.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiResizable3 = {
  name: 'Nested mixed-direction resizable layout.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Nested mixed-direction resizable layout.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiResizable4 = {
  name: 'Nested resizable',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Nested resizable' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiResizable5 = {
  name: 'Handle with animated pill indicator',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Handle with animated pill indicator' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiResizable6 = {
  name: 'Handle pill with spring scale on drag',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Handle pill with spring scale on drag' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiResizable7 = {
  name: 'Handle with large capsule expansion on drag',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Handle with large capsule expansion on drag' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiResizable8 = {
  name: 'Nested layout with animated pill handles',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Nested layout with animated pill handles' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiResizable9 = {
  name: 'Three-panel layout with animated pill handles',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Three-panel layout with animated pill handles' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiResizable10 = {
  name: 'State-tracked resizable layout.',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'State-tracked resizable layout.' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
