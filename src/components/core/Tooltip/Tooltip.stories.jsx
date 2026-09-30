import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Tooltip from './Tooltip';
import Button from '../Button';
import Icon from '../Icon';

export default {
  tags: ['autodocs'],
  title: 'Core/Tooltip',
  component: Tooltip,
  ...applicationDocs(
    'Short, supplementary hints for named controls. Pass content and a single ref-forwarding trigger. Never put interactive content in a tooltip.',
    "import Tooltip from '@gaudi/design-system/core/Tooltip';\nimport { Button } from '@gaudi/design-system';\n\n<Tooltip content='Copy a link to this article'><Button variant='outline' tone='neutral'>Copy link</Button></Tooltip>",
    'Available on focus and hover, dismisses with Escape. The trigger still needs its own accessible name; use Dialog or Popover for interactive details.'
  )
};

export const ActionHint = {
  parameters: {
    docs: {
      source: {
        code: "<Tooltip content='Copy a link to this article'><Button variant='outline' tone='neutral'>Copy link</Button></Tooltip>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Tooltip content='Copy a link to this article'>
        <Button variant='outline' tone='neutral'>
          Copy link
        </Button>
      </Tooltip>
    </ExampleFrame>
  )
};

export const KeyboardHint = {
  parameters: {
    docs: {
      source: {
        code: "<Tooltip content='Search articles, topics and references'><Button variant='outline' tone='neutral'><Icon name='Search' decorative size='xs' />Search</Button></Tooltip>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Tooltip content='Search articles, topics and references'>
        <Button variant='outline' tone='neutral'>
          <Icon name='Search' decorative size='xs' />
          Search
        </Button>
      </Tooltip>
    </ExampleFrame>
  )
};

export const LongHint = {
  parameters: {
    docs: {
      source: {
        code: "<Tooltip content='This explanation wraps within the viewport, including on narrow phones.'><Button variant='ghost'>About this collection</Button></Tooltip>"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Tooltip content='This explanation wraps within the viewport, including on narrow phones.'>
        <Button variant='ghost'>About this collection</Button>
      </Tooltip>
    </ExampleFrame>
  )
};
