import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { expect, within } from 'storybook/test';
import Button from '../Button';
import Pill from '../Pill';
import Card from './Card';

const componentDocs = getComponentDocs('Core/Card');

export default {
  argTypes: {
    'padding': {
      'control': 'select',
      'options': [ 'none', 'sm', 'md', 'lg' ]
    },
    'titleLevel': {
      'control': 'select',
      'options': [ 2, 3, 4, 5, 6 ]
    },
    'variant': {
      'control': 'select',
      'options': [ 'elevated', 'outline', 'soft', 'flat' ]
    }
  },
  component: Card,
  parameters: {
    docs: {
      description: {
        component: componentDocs.description
      },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-card',
  title: 'Core/Card'
};

export const Variants = {
  'render': () => (
    <div className='grid max-w-4xl gap-4 p-6 md:grid-cols-4'>
      {[ 'elevated', 'outline', 'soft', 'flat' ].map((variant) => (
        <Card key={ variant } title={ variant } subtitle='Reusable card style.' variant={ variant } />
      ))}
    </div>
  ),
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const variant of [ 'elevated', 'outline', 'soft', 'flat' ]) {
      const heading = canvas.getByRole('heading', { 'level': 3, 'name': variant });
      const card = heading.closest('div')?.parentElement;

      await expect(heading).toBeVisible();
      await expect(within(card).getByText('Reusable card style.')).toBeVisible();
    }
  }
};

export const Default = {
  'args': {
    'subtitle': 'Reusable content frame with title, description, and optional actions.',
    title: 'Design System Card'
  },
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { 'level': 3, 'name': 'Design System Card' });
    const card = heading.closest('div')?.parentElement;
    const subtitle = canvas.getByText('Reusable content frame with title, description, and optional actions.');

    await expect(heading).toBeVisible();
    await expect(subtitle).toBeVisible();
    await expect(card).toContainElement(heading);
    await expect(card).toContainElement(subtitle);
  }
};

export const WithContent = {
  'render': () => (
    <div className='max-w-md p-6'>
      <Card title='Building with tokens' subtitle='Cards should be plain containers, not layout decoration.'>
        <div className='mt-4 flex items-center gap-3'>
          <Pill tone='blue'>Foundations</Pill>
          <Button variant='outline' tone='neutral' size='sm'>Open</Button>
        </div>
      </Card>
    </div>
  ),
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { 'level': 3, 'name': 'Building with tokens' })).toBeInTheDocument();
    await expect(canvas.getByText('Cards should be plain containers, not layout decoration.')).toBeVisible();
    await expect(canvas.getByText('Foundations')).toBeVisible();
    await expect(canvas.getByRole('button', { 'name': 'Open' })).toBeEnabled();
  }
};

export const Padding = {
  'render': () => (
    <div className='grid max-w-4xl gap-4 p-6 md:grid-cols-4'>
      {[ 'none', 'sm', 'md', 'lg' ].map((padding) => (
        <Card key={ padding } padding={ padding } title={ padding } subtitle='Padding scale.'>
          {padding === 'none' ? <div className='mt-3 border-t border-gray-200 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300'>Content supplies its own spacing.</div> : null}
        </Card>
      ))}
    </div>
  ),
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const padding of [ 'none', 'sm', 'md', 'lg' ]) {
      await expect(canvas.getByRole('heading', { 'level': 3, 'name': padding })).toBeVisible();
    }

    await expect(canvas.getByText('Content supplies its own spacing.')).toBeVisible();
  }
};

export const Interactive = {
  'render': () => (
    <div className='max-w-md p-6'>
      <Card interactive title='Interactive card' subtitle='Hover elevation is only a visual hint. The action remains a real button.'>
        <div className='mt-4'>
          <Button href='/blog' size='sm'>Open article</Button>
        </div>
      </Card>
    </div>
  ),
  'play': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { 'level': 3, 'name': 'Interactive card' });
    const card = heading.closest('div')?.parentElement;
    const link = canvas.getByRole('link', { 'name': 'Open article' });

    await expect(card).toContainElement(link);
    await expect(link).toBeVisible();
    await expect(new URL(link.href).pathname).toBe('/blog');
  }
};
