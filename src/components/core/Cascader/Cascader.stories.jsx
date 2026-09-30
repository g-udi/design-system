import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Button from '../Button';
import {
  Cascader,
  CascaderBreadcrumb,
  CascaderContent,
  CascaderEmpty,
  CascaderInput,
  CascaderItems,
  CascaderList,
  CascaderNav,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  CascaderValue
} from './index.js';

const docs = getComponentDocs('Core/Cascader');
const topics = [
  {
    value: 'billing',
    label: 'Billing',
    children: [
      { value: 'billing.invoice', label: 'Invoice question' },
      { value: 'billing.refund', label: 'Refund request' }
    ]
  },
  {
    value: 'technical',
    label: 'Technical',
    children: [
      { value: 'technical.bug', label: 'Bug report' },
      { value: 'technical.performance', label: 'Performance' }
    ]
  },
  { value: 'feedback', label: 'Product feedback' }
];
const parts = `  <CascaderTrigger aria-label='Topic' render={<Button variant='outline' />}>
    <CascaderValue placeholder='Select a topic' />
  </CascaderTrigger>
  <CascaderContent>
    <CascaderPanel>
      <CascaderNav><CascaderInput /></CascaderNav>
      <CascaderBreadcrumb />
      <CascaderEmpty />
      <CascaderList><CascaderItems /></CascaderList>
      <CascaderStatus />
    </CascaderPanel>
  </CascaderContent>`;

export default {
  title: 'Core/Cascader',
  id: 'core-cascader',
  component: Cascader,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    mode: ['drill', 'columns'],
    selectable: ['leaf', 'all'],
    multiple: 'boolean',
    disabled: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { mode: 'drill', selectable: 'leaf', multiple: false, disabled: false, onValueChange: fn() },
  parameters: {
    docs: {
      source: playgroundSource('Cascader', {
        imports: `import { Button, Cascader, CascaderBreadcrumb, CascaderContent, CascaderEmpty, CascaderInput, CascaderItems, CascaderList, CascaderNav, CascaderPanel, CascaderStatus, CascaderTrigger, CascaderValue } from '@gaudi/design-system';\n\nconst items = ${JSON.stringify(topics, null, 2)};`,
        children: parts
      })
    }
  },
  render: (args) => (
    <Cascader key={`${args.mode}-${args.multiple}`} items={topics} {...args}>
      <CascaderTrigger aria-label='Topic' render={<Button variant='outline' className='w-72 justify-between font-normal' />}>
        <CascaderValue placeholder='Select a topic' />
      </CascaderTrigger>
      <CascaderContent className='w-80'>
        <CascaderPanel>
          <CascaderNav><CascaderInput /></CascaderNav>
          <CascaderBreadcrumb />
          <CascaderEmpty />
          <CascaderList><CascaderItems /></CascaderList>
          <CascaderStatus />
        </CascaderPanel>
      </CascaderContent>
    </Cascader>
  ),
  play: async ({ args, canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Topic' });
    if (args.disabled) return expect(trigger).toBeDisabled();
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole('option', { name: /Technical/ }));
    await userEvent.click(await page.findByRole('option', { name: /Bug report/ }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(args.multiple ? ['technical.bug'] : 'technical.bug', expect.anything());
    if (args.multiple) await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    // The popup unmounts after its exit transition; axe runs once it has gone.
    await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-base-ui-focus-guard]')).toBeNull());
    await expect(trigger).toHaveTextContent('Bug report');
  }
};
