// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/sheet/c-sheet-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/sheet/c-sheet-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/sheet/c-sheet-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/sheet/c-sheet-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/sheet/c-sheet-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/sheet/c-sheet-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/sheet/c-sheet-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/sheet/c-sheet-4.jsx?raw';

export default {
  title: 'Core/Dialog',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='sheet'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Sheet compositions owned by Gaudi Dialog. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiSheet1 = {
  name: 'Sheet: Sheet containing a form for editing profile information.',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story: 'Sheet containing a form for editing profile information.'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiSheet2 = {
  name: 'Sheet: Sheet containing a form for editing profile information.',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: {
        story: 'Sheet containing a form for editing profile information.'
      },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiSheet3 = {
  name: 'Sheet: Sheets that open from any side.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Sheets that open from any side.' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiSheet4 = {
  name: 'Sheet: Sheet with scrollable content',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Sheet with scrollable content' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
