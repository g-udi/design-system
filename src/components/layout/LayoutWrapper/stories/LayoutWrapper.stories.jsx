import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';

import LayoutWrapper from '..';

import Typography from '../../../../foundations/Typography';

const story = description => ({
  docs: {
    description: {
      story: description
    }
  }
});

const footerSections = [{
  'links': [{
    'href': '/blog/categories/engineering',
    'label': 'Engineering'
  }, {
    'href': '/blog/categories/data',
    'label': 'Data'
  }, {
    'href': '/blog/categories/productivity',
    'label': 'Productivity'
  }],
  'title': 'Categories'
}, {
  'links': [{
    'href': '/blog/projects/gaudi',
    'label': 'Gaudi'
  }],
  'title': 'Projects'
}, {
  'links': [{
    'href': '/about',
    'label': 'Summary'
  }, {
    'href': '/blog/publications',
    'label': 'Publications'
  }],
  'title': 'About'
}];

export const PageShell = {
  name: 'LayoutWrapper',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const footer = canvas.getByRole('contentinfo');
    const shell = footer.parentElement;
    const originalWidth = shell.style.width;

    try {
      shell.style.width = '320px';
      const shellBounds = shell.getBoundingClientRect();
      const footerBounds = footer.getBoundingClientRect();

      expect(footerBounds.left).toBeGreaterThan(shellBounds.left);
      expect(footerBounds.right).toBeLessThan(shellBounds.right);
      expect(footer.scrollWidth).toBeLessThanOrEqual(footer.clientWidth + 1);
    } finally {
      shell.style.width = originalWidth;
    }
  },
  parameters: { ...story('The page shell: shared navigation, a main landmark, and the footer around page content.'), __id: 'layout-components--page-shell' },
  render: () => <LayoutWrapper footerProps={{
    'newsletterProps': {
      'endpoint': '#newsletter'
    },
    'sections': footerSections
  }}>
      <div className='py-16'>
        <Typography as='h1' variant='heading-xl'>Application page shell</Typography>
        <Typography variant='paragraph-md' className='mt-4'>LayoutWrapper composes the shared navigation, main landmark, and footer.</Typography>
      </div>
    </LayoutWrapper>
};

const docs = getComponentDocs('Layout/LayoutWrapper');

export default {
  title: 'Layout/LayoutWrapper',
  id: 'layout-layout-wrapper',
  component: LayoutWrapper,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => PageShell }) } }
};
import { expect, within } from 'storybook/test';
