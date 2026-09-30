import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/dialog/c-dialog-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/dialog/c-dialog-10.jsx?raw';

export default {
  title: 'Core/Dialog',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='dialog'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Dialog compositions owned by Gaudi Dialog. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiDialog1 = {
  play: catalogueInteractions['dialog-1'],
  name: 'Basic dialog',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic dialog' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiDialog2 = {
  name: 'Dialog with scrollable content',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Dialog with scrollable content' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiDialog3 = {
  name: 'Dialog with scrollable content and sticky footer.',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: {
        story: 'Dialog with scrollable content and sticky footer.'
      },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiDialog4 = {
  name: 'Dialog without a close button.',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Dialog without a close button.' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiDialog5 = {
  name: 'Dialog with custom close button',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Dialog with custom close button' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiDialog6 = {
  name: 'Full-screen fluid dialog with sticky header and footer',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story: 'Full-screen fluid dialog with sticky header and footer'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiDialog7 = {
  name: 'Confirmation dialog with destructive action',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Confirmation dialog with destructive action' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiDialog8 = {
  name: 'Cookie consent dialog',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Cookie consent dialog' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiDialog9 = {
  name: 'Dialog with keyboard shortcuts list',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Dialog with keyboard shortcuts list' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiDialog10 = {
  name: 'Dialog with full width button',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Dialog with full width button' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
