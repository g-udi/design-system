// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import {
  CatalogueFrame,
  publicSource
} from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';
import { Pattern as Pattern1 } from '../../../../.storybook/fixtures/reui/command/c-command-1.jsx';
import source1 from '../../../../.storybook/fixtures/reui/command/c-command-1.jsx?raw';
import { Pattern as Pattern2 } from '../../../../.storybook/fixtures/reui/command/c-command-2.jsx';
import source2 from '../../../../.storybook/fixtures/reui/command/c-command-2.jsx?raw';
import { Pattern as Pattern3 } from '../../../../.storybook/fixtures/reui/command/c-command-3.jsx';
import source3 from '../../../../.storybook/fixtures/reui/command/c-command-3.jsx?raw';
import { Pattern as Pattern4 } from '../../../../.storybook/fixtures/reui/command/c-command-4.jsx';
import source4 from '../../../../.storybook/fixtures/reui/command/c-command-4.jsx?raw';
import { Pattern as Pattern5 } from '../../../../.storybook/fixtures/reui/command/c-command-5.jsx';
import source5 from '../../../../.storybook/fixtures/reui/command/c-command-5.jsx?raw';
import { Pattern as Pattern6 } from '../../../../.storybook/fixtures/reui/command/c-command-6.jsx';
import source6 from '../../../../.storybook/fixtures/reui/command/c-command-6.jsx?raw';
import { Pattern as Pattern7 } from '../../../../.storybook/fixtures/reui/command/c-command-7.jsx';
import source7 from '../../../../.storybook/fixtures/reui/command/c-command-7.jsx?raw';
import { Pattern as Pattern8 } from '../../../../.storybook/fixtures/reui/command/c-command-8.jsx';
import source8 from '../../../../.storybook/fixtures/reui/command/c-command-8.jsx?raw';

export default {
  title: 'Core/CmdLauncher',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CatalogueFrame family='command'>
        <Story />
      </CatalogueFrame>
    )
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Command compositions owned by Gaudi CmdLauncher. Practical patterns adapted from the ReUI MIT catalogue. Accessibility: label controls, preserve keyboard operation and focus return, and announce validation and async states. Example data is illustrative; application callbacks own persistence.'
      }
    }
  }
};

export const ReuiCommand1 = {
  name: 'Command: Basic command',
  render: () => <Pattern1 />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('combobox');
    await expect(canvasElement.querySelector('[aria-selected="true"]')).toBeNull();
    await userEvent.click(search);
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(search, 'Billing');
    await expect(canvas.getByRole('option', { name: /Billing/ })).toBeVisible();
    await userEvent.clear(search);
  },
  parameters: {
    docs: {
      description: { story: 'Basic command' },
      source: { code: publicSource(source1), language: 'jsx' }
    }
  }
};
export const ReuiCommand2 = {
  name: 'Command: Command with shortcuts',
  render: () => <Pattern2 />,
  parameters: {
    docs: {
      description: { story: 'Command with shortcuts' },
      source: { code: publicSource(source2), language: 'jsx' }
    }
  }
};
export const ReuiCommand3 = {
  name: 'Command: Command with groups',
  render: () => <Pattern3 />,
  parameters: {
    docs: {
      description: { story: 'Command with groups' },
      source: { code: publicSource(source3), language: 'jsx' }
    }
  }
};
export const ReuiCommand4 = {
  name: 'Command: Command with many groups',
  render: () => <Pattern4 />,
  parameters: {
    docs: {
      description: { story: 'Command with many groups' },
      source: { code: publicSource(source4), language: 'jsx' }
    }
  }
};
export const ReuiCommand5 = {
  name: 'Command: File search command palette',
  render: () => <Pattern5 />,
  parameters: {
    docs: {
      description: { story: 'File search command palette' },
      source: { code: publicSource(source5), language: 'jsx' }
    }
  }
};
export const ReuiCommand6 = {
  name: 'Command: User search command with avatars',
  render: () => <Pattern6 />,
  parameters: {
    docs: {
      description: { story: 'User search command with avatars' },
      source: { code: publicSource(source6), language: 'jsx' }
    }
  }
};
export const ReuiCommand7 = {
  name: 'Command: Action palette with keyboard shortcuts',
  render: () => <Pattern7 />,
  parameters: {
    docs: {
      description: { story: 'Action palette with keyboard shortcuts' },
      source: { code: publicSource(source7), language: 'jsx' }
    }
  }
};
export const ReuiCommand8 = {
  name: 'Command: Command with recent and favorites sections',
  render: () => <Pattern8 />,
  parameters: {
    docs: {
      description: { story: 'Command with recent and favorites sections' },
      source: { code: publicSource(source8), language: 'jsx' }
    }
  }
};
