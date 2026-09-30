// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/marker/c-marker-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/marker/c-marker-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/marker/c-marker-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/marker/c-marker-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/marker/c-marker-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/marker/c-marker-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/marker/c-marker-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/marker/c-marker-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/marker/c-marker-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/marker/c-marker-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/marker/c-marker-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/marker/c-marker-6.jsx?raw';

export default {
  title: 'Core/Marker',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='marker'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Marker compositions owned by Gaudi Marker. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiMarker1 = {
  name: 'Default, separator, and border markers',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Default, separator, and border markers' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiMarker2 = {
  name: 'Tool call log with icon markers',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Tool call log with icon markers' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiMarker3 = {
  name: 'Run status markers with a live step',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Run status markers with a live step' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiMarker4 = {
  name: 'Agent run log grouped by phase separators',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Agent run log grouped by phase separators' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiMarker5 = {
  name: 'Changed files summary with border markers',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Changed files summary with border markers' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiMarker6 = {
  name: 'Markers as links and as an action button',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Markers as links and as an action button' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
