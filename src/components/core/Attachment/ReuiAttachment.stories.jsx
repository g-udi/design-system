// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/attachment/c-attachment-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/attachment/c-attachment-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/attachment/c-attachment-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/attachment/c-attachment-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/attachment/c-attachment-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/attachment/c-attachment-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/attachment/c-attachment-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/attachment/c-attachment-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/attachment/c-attachment-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/attachment/c-attachment-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/attachment/c-attachment-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/attachment/c-attachment-6.jsx?raw';

export default {
  title: 'Core/Attachment',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='attachment'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Attachment compositions owned by Gaudi Attachment. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiAttachment1 = {
  name: 'Single file attachment in an assistant reply',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Single file attachment in an assistant reply' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiAttachment2 = {
  name: 'Composer tray with removable attachments',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Composer tray with removable attachments' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiAttachment3 = {
  name: 'Image thumbnails in a snapping strip',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Image thumbnails in a snapping strip' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiAttachment4 = {
  name: 'Three sizes carrying three levels of an answer',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Three sizes carrying three levels of an answer' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiAttachment5 = {
  name: 'Upload queue across all five states',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Upload queue across all five states' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiAttachment6 = {
  name: 'File picker that fills an attachment tray',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'File picker that fills an attachment tray' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
