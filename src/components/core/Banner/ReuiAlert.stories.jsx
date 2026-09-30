// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/alert/c-alert-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/alert/c-alert-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/alert/c-alert-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/alert/c-alert-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/alert/c-alert-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/alert/c-alert-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/alert/c-alert-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/alert/c-alert-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/alert/c-alert-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/alert/c-alert-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/alert/c-alert-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/alert/c-alert-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/alert/c-alert-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/alert/c-alert-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/alert/c-alert-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/alert/c-alert-8.jsx?raw';
import { Pattern as Pattern9 } from '../../../../.storybook/fixtures/reui/alert/c-alert-9.jsx';
import source9 from '../../../../.storybook/fixtures/reui/alert/c-alert-9.jsx?raw';
import { Pattern as Pattern10 } from '../../../../.storybook/fixtures/reui/alert/c-alert-10.jsx';
import source10 from '../../../../.storybook/fixtures/reui/alert/c-alert-10.jsx?raw';
import { Pattern as Pattern11 } from '../../../../.storybook/fixtures/reui/alert/c-alert-11.jsx';
import source11 from '../../../../.storybook/fixtures/reui/alert/c-alert-11.jsx?raw';
import { Pattern as Pattern12 } from '../../../../.storybook/fixtures/reui/alert/c-alert-12.jsx';
import source12 from '../../../../.storybook/fixtures/reui/alert/c-alert-12.jsx?raw';
import { Pattern as Pattern13 } from '../../../../.storybook/fixtures/reui/alert/c-alert-13.jsx';
import source13 from '../../../../.storybook/fixtures/reui/alert/c-alert-13.jsx?raw';
import { Pattern as Pattern14 } from '../../../../.storybook/fixtures/reui/alert/c-alert-14.jsx';
import source14 from '../../../../.storybook/fixtures/reui/alert/c-alert-14.jsx?raw';
import { Pattern as Pattern15 } from '../../../../.storybook/fixtures/reui/alert/c-alert-15.jsx';
import source15 from '../../../../.storybook/fixtures/reui/alert/c-alert-15.jsx?raw';
import { Pattern as Pattern16 } from '../../../../.storybook/fixtures/reui/alert/c-alert-16.jsx';
import source16 from '../../../../.storybook/fixtures/reui/alert/c-alert-16.jsx?raw';
import { Pattern as Pattern17 } from '../../../../.storybook/fixtures/reui/alert/c-alert-17.jsx';
import source17 from '../../../../.storybook/fixtures/reui/alert/c-alert-17.jsx?raw';
import { Pattern as Pattern18 } from '../../../../.storybook/fixtures/reui/alert/c-alert-18.jsx';
import source18 from '../../../../.storybook/fixtures/reui/alert/c-alert-18.jsx?raw';
import { Pattern as Pattern19 } from '../../../../.storybook/fixtures/reui/alert/c-alert-19.jsx';
import source19 from '../../../../.storybook/fixtures/reui/alert/c-alert-19.jsx?raw';
import { Pattern as Pattern20 } from '../../../../.storybook/fixtures/reui/alert/c-alert-20.jsx';
import source20 from '../../../../.storybook/fixtures/reui/alert/c-alert-20.jsx?raw';

export default {
  title: 'Core/Banner',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='alert'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Alert compositions owned by Gaudi Banner. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiAlert1 = {
  name: 'Alert: Basic alert',
  render: () => <Pattern1 />,
  parameters: {
    docs: {
      description: { story: 'Basic alert' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiAlert2 = {
  name: 'Alert: Alert with icon',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Alert with icon' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiAlert3 = {
  name: 'Alert: Alert with icon and action buttons',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Alert with icon and action buttons' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiAlert4 = {
  name: 'Alert: Destructive alert with icon and action buttons',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Destructive alert with icon and action buttons' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiAlert5 = {
  name: 'Alert: Info alert with icon and action buttons',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'Info alert with icon and action buttons' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiAlert6 = {
  name: 'Alert: Success alert',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'Success alert' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiAlert7 = {
  name: 'Alert: Warning alert',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Warning alert' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiAlert8 = {
  name: 'Alert: Error alert',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Error alert' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
export const ReuiAlert9 = {
  name: 'Alert: Invert alert',
  render: () => <Pattern9 />,
  parameters: {
    docs: {
      description: { story: 'Invert alert' },
      source: { code: publicSource(source9), language: 'jsx' }
    }
  }
};
export const ReuiAlert10 = {
  name: 'Alert: Alert with icon and action buttons',
  render: () => <Pattern10 />,
  parameters: {
    docs: {
      description: { story: 'Alert with icon and action buttons' },
      source: { code: publicSource(source10), language: 'jsx' }
    }
  }
};
export const ReuiAlert11 = {
  name: 'Alert: Alert with description and action buttons',
  render: () => <Pattern11 />,
  parameters: {
    docs: {
      description: { story: 'Alert with description and action buttons' },
      source: { code: publicSource(source11), language: 'jsx' }
    }
  }
};
export const ReuiAlert12 = {
  name: 'Alert: Alert integrated within a Frame with reset borders',
  render: () => <Pattern12 />,
  parameters: {
    docs: {
      description: {
        story: 'Alert integrated within a Frame with reset borders'
      },
      source: { code: publicSource(source12), language: 'jsx' }
    }
  }
};
export const ReuiAlert13 = {
  name: 'Alert: Stacked alerts within a Frame',
  render: () => <Pattern13 />,
  parameters: {
    docs: {
      description: { story: 'Stacked alerts within a Frame' },
      source: { code: publicSource(source13), language: 'jsx' }
    }
  }
};
export const ReuiAlert14 = {
  name: 'Alert: Alert with actions integrated within a Frame',
  render: () => <Pattern14 />,
  parameters: {
    docs: {
      description: { story: 'Alert with actions integrated within a Frame' },
      source: { code: publicSource(source14), language: 'jsx' }
    }
  }
};
export const ReuiAlert15 = {
  name: 'Alert: Inverted alert variant',
  render: () => <Pattern15 />,
  parameters: {
    docs: {
      description: { story: 'Inverted alert variant' },
      source: { code: publicSource(source15), language: 'jsx' }
    }
  }
};
export const ReuiAlert16 = {
  name: 'Alert: Urgent billing notice',
  render: () => <Pattern16 />,
  parameters: {
    docs: {
      description: { story: 'Urgent billing notice' },
      source: { code: publicSource(source16), language: 'jsx' }
    }
  }
};
export const ReuiAlert17 = {
  name: 'Alert: Service status summary stacked within a frame',
  render: () => <Pattern17 />,
  parameters: {
    docs: {
      description: { story: 'Service status summary stacked within a frame' },
      source: { code: publicSource(source17), language: 'jsx' }
    }
  }
};
export const ReuiAlert18 = {
  name: 'Alert: Feature discovery alert',
  render: () => <Pattern18 />,
  parameters: {
    docs: {
      description: { story: 'Feature discovery alert' },
      source: { code: publicSource(source18), language: 'jsx' }
    }
  }
};
export const ReuiAlert19 = {
  name: 'Alert: User message notification alert',
  render: () => <Pattern19 />,
  parameters: {
    docs: {
      description: { story: 'User message notification alert' },
      source: { code: publicSource(source19), language: 'jsx' }
    }
  }
};
export const ReuiAlert20 = {
  name: 'Alert: User message notification alert',
  render: () => <Pattern20 />,
  parameters: {
    docs: {
      description: { story: 'User message notification alert' },
      source: { code: publicSource(source20), language: 'jsx' }
    }
  }
};
