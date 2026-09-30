// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/scrollspy/c-scrollspy-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/scrollspy/c-scrollspy-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/scrollspy/c-scrollspy-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/scrollspy/c-scrollspy-2.jsx?raw';

export default {
  title: 'Core/Scrollspy',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='scrollspy'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Scrollspy compositions owned by Gaudi Scrollspy. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiScrollspy1 = {
  name: 'Basic scrollspy',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic scrollspy' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiScrollspy2 = {
  name: 'Basic scroll area',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Basic scroll area' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
