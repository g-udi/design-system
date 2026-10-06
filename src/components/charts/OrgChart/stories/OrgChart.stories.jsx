import { expect, fn, userEvent, within } from 'storybook/test';
import { OrgChart } from '../index.js';
import { organization } from './fixtures/organization.js';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';

const docs = getComponentDocs('Charts/OrgChart');
const imports = `import { OrgChart } from '@gaudi/design-system/charts/OrgChart';\n\nconst organization = ${JSON.stringify(organization, null, 2)};`;

export default {
  title: 'Charts/OrgChart', id: 'charts-orgchart', component: OrgChart, tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', disabled: 'boolean' }),
  parameters: {
    docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => Playground }) }
  }
};

export const Playground = {
  args: { label: 'Product organization', disabled: false, onNodeClick: fn(), onCollapsedIdsChange: fn() },
  parameters: { docs: { source: playgroundSource('OrgChart', { imports, attributes: ['data={organization}'] }) } },
  render: (args) => <OrgChart data={organization} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Hide reports for Bram Ellery' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    if (args.disabled) { await expect(toggle).toBeDisabled(); return; }
    toggle.focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.queryByRole('button', { name: 'Jordan Lee', exact: true })).not.toBeInTheDocument();
    await expect(args.onCollapsedIdsChange).toHaveBeenLastCalledWith(['alex']);
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('button', { name: 'Jordan Lee', exact: true })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Riley Morgan', exact: true }));
    await expect(args.onNodeClick).toHaveBeenCalledWith(organization);
  }
};

export const DepartmentOverview = {
  name: 'Collapsed departments',
  parameters: { docs: { source: { code: `${imports}\n\n<OrgChart data={organization} defaultCollapsedIds={['alex', 'casey']} />` } } },
  render: () => <OrgChart data={organization} defaultCollapsedIds={['alex', 'casey']} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show reports for Casey Brooks' }));
    await expect(canvas.getByText('Morgan Park')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Hide reports for Casey Brooks' }));
    await expect(canvas.queryByText('Morgan Park')).not.toBeInTheDocument();
  }
};

export const Empty = {
  parameters: { docs: { source: { code: "import { OrgChart } from '@gaudi/design-system/charts/OrgChart';\n\n<OrgChart data={null} />" } } },
  render: () => <OrgChart data={null} />,
  play: async ({ canvasElement }) => { await expect(within(canvasElement).getByText('No people to display')).toBeVisible(); }
};
