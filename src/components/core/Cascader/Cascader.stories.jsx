import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import {
  Cascader,
  CascaderBreadcrumb,
  CascaderColumns,
  CascaderEmpty,
  CascaderInput,
  CascaderItems,
  CascaderList,
  CascaderNav,
  CascaderPanel,
  CascaderStatus,
  useCascaderSelection
} from './index.js';

const docs = getComponentDocs('Core/Cascader');
// Help-centre routing: icons, descriptions, a disabled enterprise-only topic, and a top-level leaf.
const topics = [
  {
    value: 'billing',
    label: 'Billing',
    icon: 'CreditCardIcon',
    children: [
      { value: 'billing.invoice', label: 'Invoice question', icon: 'ReceiptIcon', description: 'Download or correct an invoice' },
      { value: 'billing.refund', label: 'Refund request', icon: 'ArrowLeftRightIcon', description: 'Money back within 30 days' }
    ]
  },
  {
    value: 'technical',
    label: 'Technical',
    icon: 'WrenchIcon',
    children: [
      { value: 'technical.bug', label: 'Bug report', icon: 'BugIcon', description: 'Something is broken' },
      { value: 'technical.performance', label: 'Performance', icon: 'GaugeIcon', description: 'Slow pages or timeouts' },
      { value: 'technical.api', label: 'API and webhooks', icon: 'CodeIcon', description: 'Tokens, limits and events' }
    ]
  },
  {
    value: 'account',
    label: 'Account',
    icon: 'UsersIcon',
    children: [
      { value: 'account.access', label: 'Team access', icon: 'KeyRoundIcon', description: 'Invite or remove members' },
      { value: 'account.sso', label: 'Single sign-on', icon: 'LockIcon', description: 'Enterprise plans only', disabled: true }
    ]
  },
  { value: 'feedback', label: 'Product feedback', icon: 'LightbulbIcon', description: 'Ideas and feature requests' }
];
const withIcons = (nodes) => nodes.map(({ icon, children, ...node }) => ({
  ...node,
  icon: <RegistryIcon lucide={icon} className='size-4' />,
  ...(children ? { children: withIcons(children) } : null)
}));
const items = withIcons(topics);
// The panel opens inside Technical with a saved choice: a bug report, or the whole Technical branch
// when branches are selectable. The test then picks Performance.
const opened = 'technical';
const savedFor = (selectable) => (selectable === 'all' ? opened : 'technical.bug');
const target = 'technical.performance';
const nodes = topics.flatMap((topic) => [topic, ...(topic.children || [])]);
const pathOf = (value) => nodes.filter((node) => value === node.value || value.startsWith(`${node.value}.`)).map((node) => node.label).join(' › ');
const sourceItems = JSON.stringify(topics, null, 2).replace(/"icon": "(\w+)"/g, "\"icon\": <RegistryIcon lucide='$1' />");

function Routing() {
  const { paths, isEmpty } = useCascaderSelection();
  return (
    <p className='border-t border-ui-border px-3 py-2 text-xs text-ui-muted-foreground'>
      {isEmpty ? 'No topic chosen yet' : `Routing to ${paths.map((path) => path.map((node) => node.label).join(' › ')).join(', ')}`}
    </p>
  );
}

export default {
  title: 'Core/Inputs/Cascader',
  id: 'core-cascader',
  component: Cascader,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    mode: ['drill', 'columns', 'tree'],
    selectable: ['leaf', 'all'],
    multiple: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-xl'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { mode: 'columns', selectable: 'leaf', multiple: false, onValueChange: fn() },
  parameters: {
    docs: {
      description: { story: 'An inline help-centre router with icons, descriptions, a disabled enterprise-only topic, and a live summary of the selection. `mode` switches between drill-down, Miller columns and a tree; `multiple` adds checkboxes; `selectable: all` saves the whole Technical branch instead of one leaf.' },
      source: playgroundSource('Cascader', {
        imports: `import { Cascader, CascaderBreadcrumb, CascaderColumns, CascaderEmpty, CascaderInput, CascaderItems, CascaderList, CascaderNav, CascaderPanel, CascaderStatus } from '@gaudi/design-system';\nimport { RegistryIcon } from '@gaudi/design-system/icons';\n\nconst topics = ${sourceItems};`,
        attributes: ['inline', 'items={topics}', "defaultValue='technical.bug'"],
        children: `  <CascaderPanel>
    <CascaderNav><CascaderInput placeholder='Search topics' /></CascaderNav>
    <CascaderBreadcrumb />
    <CascaderEmpty />
    {mode === 'columns' ? <CascaderColumns maxHeight={240} /> : <CascaderList maxHeight={240}><CascaderItems /></CascaderList>}
    <CascaderStatus />
  </CascaderPanel>`
      })
    }
  },
  render: (args) => (
    <Cascader
      key={`${args.mode}-${args.multiple}-${args.selectable}`}
      inline
      items={items}
      defaultValue={args.multiple ? [savedFor(args.selectable)] : savedFor(args.selectable)}
      {...(args.mode === 'tree' ? { defaultExpanded: [opened] } : { defaultPath: [opened] })}
      {...args}
    >
      <div className='overflow-hidden rounded-xl border border-ui-border bg-ui-background'>
        <CascaderPanel>
          <CascaderNav><CascaderInput placeholder='Search topics' /></CascaderNav>
          <CascaderBreadcrumb />
          <CascaderEmpty />
          {args.mode === 'columns' ? <CascaderColumns maxHeight={240} /> : <CascaderList maxHeight={240}><CascaderItems /></CascaderList>}
          <CascaderStatus />
        </CascaderPanel>
        <Routing />
      </div>
    </Cascader>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const saved = savedFor(args.selectable);
    await expect(canvas.getByText(`Routing to ${pathOf(saved)}`)).toBeVisible();
    await userEvent.click(await canvas.findByRole(args.mode === 'tree' ? 'treeitem' : 'option', { name: new RegExp(pathOf(target).split(' › ').pop()) }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(args.multiple ? [saved, target] : target, expect.anything());
    const routed = (args.multiple ? [saved, target] : [target]).map(pathOf).join(', ');
    await waitFor(() => expect(canvas.getByText(`Routing to ${routed}`)).toBeVisible());
  }
};

export const Disabled = {
  args: { ...Playground.args, mode: 'drill', disabled: true, onValueChange: fn() },
  parameters: { docs: { description: { story: '`disabled` dims and locks the whole inline panel: the search and every option.' } } },
  render: Playground.render,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector('[data-slot="cascader-panel"]')).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByPlaceholderText('Search topics')).toBeDisabled();
    const options = canvas.getAllByRole('option');
    for (const option of options) await expect(option).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(options[0], { pointerEventsCheck: 0 });
    await expect(args.onValueChange).not.toHaveBeenCalled();
  }
};
