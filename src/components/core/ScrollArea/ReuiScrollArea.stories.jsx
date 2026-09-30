// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/scroll-area/c-scroll-area-5.jsx?raw';

export default {
  title: 'Core/ScrollArea',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='scroll-area'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Scroll Area compositions owned by Gaudi ScrollArea. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiScrollArea1 = {
  name: 'Basic scroll area',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic scroll area' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiScrollArea2 = {
  name: 'Scroll area with horizontal scrollbar',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Scroll area with horizontal scrollbar' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiScrollArea3 = {
  name: 'Scroll area with both scrollbars',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Scroll area with both scrollbars' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiScrollArea4 = {
  name: 'Scroll area with fade effect',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Scroll area with fade effect' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiScrollArea5 = {
  name: 'Scroll area with scrollbar gutter',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Scroll area with scrollbar gutter' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
