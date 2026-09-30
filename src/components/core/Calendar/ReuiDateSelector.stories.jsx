// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/date-selector/c-date-selector-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/date-selector/c-date-selector-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/date-selector/c-date-selector-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/date-selector/c-date-selector-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/date-selector/c-date-selector-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/date-selector/c-date-selector-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/date-selector/c-date-selector-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/date-selector/c-date-selector-4.jsx?raw';

export default {
  title: 'Core/Calendar',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='date-selector'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Date Selector compositions owned by Gaudi Calendar. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiDateSelector1 = {
  name: 'Date Selector: Basic date selector',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic date selector' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiDateSelector2 = {
  name: 'Date Selector: Date selector with popover',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Date selector with popover' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiDateSelector3 = {
  name: 'Date Selector: Date selector with dialog',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Date selector with dialog' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiDateSelector4 = {
  name: 'Date Selector: Date selector with dropdown menu',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Date selector with dropdown menu' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
