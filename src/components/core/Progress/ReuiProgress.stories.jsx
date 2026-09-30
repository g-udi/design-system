// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/progress/c-progress-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/progress/c-progress-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/progress/c-progress-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/progress/c-progress-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/progress/c-progress-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/progress/c-progress-3.jsx?raw';
import { BaseProgressStatus as Pattern4 } from '../../../../.storybook/fixtures/reui/progress/c-progress-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/progress/c-progress-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/progress/c-progress-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/progress/c-progress-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/progress/c-progress-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/progress/c-progress-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/progress/c-progress-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/progress/c-progress-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/progress/c-progress-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/progress/c-progress-8.jsx?raw';

export default {
  title: 'Core/Progress',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='progress'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Progress compositions owned by Gaudi Progress. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiProgress1 = {
  name: 'Basic progress.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic progress.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiProgress2 = {
  name: 'Small progress.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Small progress.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiProgress3 = {
  name: 'Large progress.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Large progress.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiProgress4 = {
  name: 'Progress bar with status messages.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Progress bar with status messages.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiProgress5 = {
  name: 'File upload list with progress & status.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'File upload list with progress & status.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiProgress6 = {
  name: 'Progress bar with slider.',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Progress bar with slider.' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiProgress7 = {
  name: 'Multi-step progress indicator',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Multi-step progress indicator' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiProgress8 = {
  name: 'Progress bar with custom colors.',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Progress bar with custom colors.' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
