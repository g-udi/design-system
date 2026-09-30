import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import DropdownMenu, {
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './DropdownMenu';
import Button from '../Button';
export default {
  tags: ['autodocs'],
  title: 'Core/DropdownMenu',
  component: DropdownMenu,
  ...applicationDocs(
    'Action menus with item, checkbox, label and separator primitives. Supply a single button trigger; onSelect belongs to each action. Disabled items stay discoverable and inactive.',
    '<DropdownMenu trigger={<Button>Article actions</Button>}><DropdownMenuItem onSelect={edit}>Edit article</DropdownMenuItem><DropdownMenuItem disabled>Publish</DropdownMenuItem></DropdownMenu>',
    'Radix implements roving focus, typeahead, Escape dismissal and focus restoration. Use Select for choosing a field value.'
  )
};
function Actions() {
  const [status, setStatus] = useState('');
  return (
    <ExampleFrame>
      <DropdownMenu
        trigger={<Button variant='outline'>Article actions</Button>}
      >
        <DropdownMenuLabel>Manage article</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => setStatus('Article duplicated in this example.')}
        >
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Publish</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          destructive
          onSelect={() => setStatus('Article archived in this example.')}
        >
          Archive
        </DropdownMenuItem>
      </DropdownMenu>
      <p role='status'>{status}</p>
    </ExampleFrame>
  );
}
export const ArticleActions = {
  render: () => <Actions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Article actions' })
    );
    await userEvent.click(
      await body.findByRole('menuitem', { name: 'Duplicate' })
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('duplicated');
  }
};
function Columns() {
  const [shown, setShown] = useState(true);
  return (
    <ExampleFrame>
      <DropdownMenu
        trigger={<Button variant='outline'>Visible columns</Button>}
      >
        <DropdownMenuCheckboxItem checked={shown} onCheckedChange={setShown}>
          Author
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked disabled>
          Title
        </DropdownMenuCheckboxItem>
      </DropdownMenu>
      <p className='ds-description'>
        Author column: {shown ? 'visible' : 'hidden'}
      </p>
    </ExampleFrame>
  );
}
export const CheckboxItems = { render: () => <Columns /> };
