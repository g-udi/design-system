// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/kbd/c-kbd-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/kbd/c-kbd-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/kbd/c-kbd-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/kbd/c-kbd-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/kbd/c-kbd-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/kbd/c-kbd-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/kbd/c-kbd-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/kbd/c-kbd-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/kbd/c-kbd-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/kbd/c-kbd-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/kbd/c-kbd-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/kbd/c-kbd-6.jsx?raw';

export default {
  title: 'Core/Kbd',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='kbd'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Kbd compositions owned by Gaudi Kbd. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiKbd1 = {
  name: 'Basic keyboard keys.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic keyboard keys.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiKbd2 = {
  name: 'Keyboard keys grouped together.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Keyboard keys grouped together.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiKbd3 = {
  name: 'Keyboard keys combined with icons.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Keyboard keys combined with icons.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiKbd4 = {
  name: 'Keyboard key within an input.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Keyboard key within an input.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiKbd5 = {
  name: 'Keyboard shortcut in a tooltip.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Keyboard shortcut in a tooltip.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiKbd6 = {
  name: 'Keyboard shortcuts reference list',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Keyboard shortcuts reference list' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
