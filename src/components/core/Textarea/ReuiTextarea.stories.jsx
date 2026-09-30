// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/textarea/c-textarea-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/textarea/c-textarea-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/textarea/c-textarea-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/textarea/c-textarea-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/textarea/c-textarea-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/textarea/c-textarea-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/textarea/c-textarea-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/textarea/c-textarea-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/textarea/c-textarea-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/textarea/c-textarea-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/textarea/c-textarea-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/textarea/c-textarea-6.jsx?raw';

export default {
  title: 'Core/Textarea',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='textarea'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Textarea compositions owned by Gaudi Textarea. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiTextarea1 = {
  name: 'Basic textarea.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic textarea.' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiTextarea2 = {
  name: 'Invalid textarea.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Invalid textarea.' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiTextarea3 = {
  name: 'Textarea with label.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Textarea with label.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiTextarea4 = {
  name: 'Textarea with description.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Textarea with description.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiTextarea5 = {
  name: 'Disabled textarea.',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Disabled textarea.' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiTextarea6 = {
  name: 'Auto-resize textarea with character count',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Auto-resize textarea with character count' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
