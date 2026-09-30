import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import CodeGroupTabs from './CodeGroupTabs';

const docs = getComponentDocs('MDX/CodeGroupTabs');
const slug = (label) => label.toLowerCase().replace(/\W+/g, '-');

/** Mirrors the `.rehype-code-group` markup that rehype-code-group emits, enhanced by the runtime. */
const CodeGroup = ({ label, blocks }) => (
  <>
    <div className='rehype-code-group'>
      <div className='rcg-tab-container' role='tablist' aria-label={label}>
        {blocks.map(({ title }, index) => (
          <button key={title} id={`tab-${slug(title)}`} className={`rcg-tab${index ? '' : ' active'}`} type='button' role='tab' aria-controls={`panel-${slug(title)}`} aria-selected={!index}>
            {title}
          </button>
        ))}
      </div>
      {blocks.map(({ title, code }, index) => (
        <div key={title} id={`panel-${slug(title)}`} className={`rcg-block${index ? '' : ' active'}`} role='tabpanel' aria-labelledby={`tab-${slug(title)}`} hidden={index > 0}>
          <figure data-rehype-pretty-code-figure=''><pre><code>{code}</code></pre></figure>
        </div>
      ))}
    </div>
    <CodeGroupTabs />
  </>
);

const initialized = (canvasElement) =>
  waitFor(() => expect(canvasElement.querySelector('.rehype-code-group')).toHaveAttribute('data-tabs-initialized', 'true'));

export default {
  title: 'MDX/CodeGroupTabs',
  id: 'mdx-codegrouptabs',
  component: CodeGroupTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  render: () => (
    <CodeGroup
      label='Code language'
      blocks={[
        { title: 'JavaScript', code: "const language = 'js';" },
        { title: 'TypeScript', code: "const language: string = 'ts';" }
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [js, ts] = ['JavaScript', 'TypeScript'].map((name) => canvas.getByRole('tab', { name }));
    await initialized(canvasElement);
    await expect(js).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(ts);
    await expect(js).toHaveAttribute('aria-selected', 'false');
    await expect(ts).toHaveAttribute('aria-selected', 'true');
    await expect(canvasElement.querySelector('#panel-javascript')).toHaveAttribute('hidden');
    await expect(canvas.getByRole('tabpanel', { name: 'TypeScript' })).toBeVisible();
  }
};

export const LongLabelsInNarrowColumn = {
  parameters: { docs: { description: { story: 'In a narrow column the tab rail scrolls horizontally and brings the selected tab into view.' } } },
  render: () => (
    <div className='max-w-sm'>
      <CodeGroup
        label='SPARQL query'
        blocks={[
          { title: 'Finding Blog Names', code: 'SELECT ?name\nWHERE {\n  ?x foaf:name ?name\n}' },
          { title: 'Finding Blog Owners Names', code: 'SELECT ?ownerName\nWHERE {\n  ?blog aa:owner ?owner .\n  ?owner foaf:name ?ownerName .\n}' },
          { title: 'Finding Blog Owner Locations', code: 'SELECT ?location\nWHERE {\n  ?owner foaf:based_near ?location .\n}' }
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const last = within(canvasElement).getByRole('tab', { name: 'Finding Blog Owner Locations' });
    await initialized(canvasElement);
    await userEvent.click(last);
    await expect(last).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(canvasElement.querySelector('.rcg-tab-container').scrollLeft).toBeGreaterThan(0));
  }
};
