// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { verifyConfirmationDialogInteraction } from '../../../../.storybook/stories/ReuiInteractions.js';
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/alert-dialog/c-alert-dialog-14.jsx?raw';

export default {
  title: 'Core/Dialog',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='alert-dialog'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Confirmation dialog compositions owned by Gaudi Dialog. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiConfirmation1 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Basic confirmation dialog with title, description, and action buttons',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: {
        story: 'Basic confirmation dialog with title, description, and action buttons'
      },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation2 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Small size confirmation dialog for quick confirmations',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Small size confirmation dialog for quick confirmations' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation3 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Confirmation dialog with icon',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Confirmation dialog with icon' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation4 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Small size confirmation dialog with media (icon)',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Small size confirmation dialog with media (icon)' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation5 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Destructive confirmation dialog for irreversible actions like deletion',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: {
        story: 'Destructive confirmation dialog for irreversible actions like deletion'
      },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation6 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Confirmation dialog nested within a standard Dialog component',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog nested within a standard Dialog component'
      },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation7 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Task success confirmation',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Task success confirmation' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation8 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Account deactivation confirmation',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Account deactivation confirmation' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation9 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Warning for unsaved changes when navigating away',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: {
        story: 'Warning for unsaved changes when navigating away'
      },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation10 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Confirmation for successful e-ticket registration',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: {
        story: 'Confirmation for successful e-ticket registration'
      },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation11 = {
  play: verifyConfirmationDialogInteraction,
  name: 'System update notification requiring application restart',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: {
        story: 'System update notification requiring application restart'
      },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation12 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Billing warning for expired subscriptions or failed payments',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: {
        story: 'Billing warning for expired subscriptions or failed payments'
      },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation13 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Logout confirmation dialog',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Logout confirmation dialog' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiConfirmation14 = {
  play: verifyConfirmationDialogInteraction,
  name: 'Advanced security audit confirmation',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Advanced security audit confirmation' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
