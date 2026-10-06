import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';

import { expect, within } from 'storybook/test';

import Footer from '..';

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

export const FooterLayout = {
  name: 'Footer',
  args: {
    brandTitle: 'Field notes',
    copyrightName: 'Ahmad Assaf',
    variant: 'standard'
  },
  argTypes: {
    brandTitle: {
      control: 'text',
      description: 'Editorial brand heading.',
      if: {
        arg: 'variant',
        eq: 'editorial'
      }
    },
    copyrightName: {
      control: 'text',
      description: 'Name in the copyright line.'
    },
    variant: {
      control: 'inline-radio',
      options: ['standard', 'editorial'],
      description: '`standard` adds the newsletter form; `editorial` leads with the brand.'
    }
  },
  parameters: { ...story('The site footer with link columns, social links, and copyright. Switch `variant` between the newsletter layout and the brand-led editorial layout.'), __id: 'layout-components--footer-layout' },
  render: args => <div className='mx-auto max-w-6xl px-6'>
      <Footer {...args} sections={footerSections} newsletterProps={{
      'endpoint': '#newsletter'
    }} />
    </div>,
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', {
      name: 'Footer navigation'
    })).toBeVisible();
    await expect(canvas.getByText(new RegExp(`${args.copyrightName}\\. All rights reserved`))).toBeVisible();
    await expect(Boolean(canvas.queryByRole('textbox', {
      name: 'Email address'
    }))).toBe(args.variant === 'standard');
  }
};

const docs = getComponentDocs('Layout/Footer');

export default {
  title: 'Layout/Footer',
  id: 'layout-footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: docs.description }, page: createComponentDocsPage(docs, { primaryStory: () => FooterLayout }) } }
};
