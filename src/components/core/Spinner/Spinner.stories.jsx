import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import Spinner from './Spinner';

const docs = getComponentDocs('Core/Spinner');
const pixels = { xs: 12, sm: 16, md: 20, lg: 32 };
const sizes = Object.keys(pixels);
const saving = 'Saving draft';
// A publish queue: the running task follows the controls; a queued check and a busy button show smaller, quieter spinners.
function Task({ spinner, title, detail }) {
  return (
    <li className='flex items-center gap-3 rounded-lg border border-border px-3 py-2.5'>
      <span className='flex size-8 shrink-0 items-center justify-center'>{spinner}</span>
      <span className='min-w-0 flex-1'>
        <span className='block truncate text-sm font-medium text-text'>{title}</span>
        <span className='block text-xs text-text-muted'>{detail}</span>
      </span>
    </li>
  );
}
const statuses = (canvasElement, name) => within(canvasElement).getAllByRole('status', { name });
// The computed width ignores the spin transform, which inflates the bounding box mid-rotation.
const width = (element) => Number.parseFloat(getComputedStyle(element).width);

export default {
  title: 'Core/Spinner',
  id: 'core-spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { size: sizes, label: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { size: 'lg', label: 'Publishing article' },
  parameters: {
    docs: {
      description: { story: 'A publish queue: the running task follows `size` and `label`, a queued link check uses a small muted spinner, and a busy button carries an `xs` spinner beside its text.' },
      source: playgroundSource('Spinner', { imports: "import { Spinner } from '@gaudi/design-system';" })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-md'><Story /></ExampleFrame>],
  render: (args) => (
    <div className='grid gap-3'>
      <ul className='m-0 grid list-none gap-2 p-0'>
        <Task spinner={<Spinner {...args} />} title={args.label} detail='Uploading images · step 2 of 3' />
        <Task spinner={<Spinner size='sm' label='Checking links' className='text-text-muted' />} title='Checking 14 links' detail='Starts after publishing' />
      </ul>
      <Button variant='outline' size='sm' disabled className='justify-self-end'>
        <Spinner size='xs' label={saving} className='text-current' />
        {saving}
      </Button>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [spinner] = statuses(canvasElement, args.label);
    await expect(getComputedStyle(spinner).animationName).not.toBe('none');
    await expect(width(spinner)).toBe(pixels[args.size]);
    await expect(canvas.getByText(args.label)).toBeVisible();
    const button = canvas.getByRole('button', { name: new RegExp(saving) });
    await expect(button).toBeDisabled();
    await expect(within(button).getByRole('status', { name: saving })).toBeInTheDocument();
  }
};
