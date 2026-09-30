import { expect, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';

import Skeleton from './Skeleton';

const componentDocs = getComponentDocs('Core/Skeleton');

export default {
  component: Skeleton,
  parameters: {
    docs: {
      description: { component: componentDocs.description },
      page: createComponentDocsPage(componentDocs)
    }
  },
  tags: [ 'autodocs' ],
  id: 'core-skeleton',
  title: 'Core/Skeleton'
};

export const Example = {
  play: async ({ canvasElement }) => {
    const placeholders = canvasElement.querySelectorAll('[aria-hidden="true"]');
    const [ headingLine, fullLine, shortLine ] = placeholders;

    await expect(placeholders).toHaveLength(3);

    placeholders.forEach((placeholder) => {
      expect(placeholder).not.toHaveAccessibleName();
      expect(getComputedStyle(placeholder).animationName).not.toBe('none');
    });

    expect(headingLine.getBoundingClientRect().height).toBeGreaterThan(fullLine.getBoundingClientRect().height);
    expect(fullLine.getBoundingClientRect().width).toBeGreaterThan(shortLine.getBoundingClientRect().width);
  },
  render: () => (
    <div className='max-w-sm space-y-3 p-6'>
      <Skeleton className='h-5 w-2 max-w-full/3' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-5 max-w-full/6' />
    </div>
  )
};

export const Loading = {
  name: 'Loading Skeletons',
  parameters: {
    chromatic: { disableSnapshot: false }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const placeholders = canvasElement.querySelectorAll('[aria-hidden="true"]');

    await expect(canvas.getByRole('region', { name: 'Article card loading' })).toBeVisible();
    await expect(canvas.getByRole('region', { name: 'Table loading' })).toBeVisible();
    await expect(canvas.getByRole('region', { name: 'Navigation loading' })).toBeVisible();
    await expect(canvas.getByRole('region', { name: 'Media loading' })).toBeVisible();
    await expect(placeholders).toHaveLength(30);

    placeholders.forEach((placeholder) => {
      expect(placeholder).toHaveAttribute('aria-hidden', 'true');
      expect(getComputedStyle(placeholder).animationName).not.toBe('none');
    });

    expect(placeholders[0].getBoundingClientRect().width).toBe(placeholders[0].getBoundingClientRect().height);
    expect(canvasElement.querySelector('[aria-label="Media loading"] [aria-hidden="true"]').getBoundingClientRect().width).toBeGreaterThan(0);
  },
  render: () => (
    <div className='grid gap-6 p-6 lg:grid-cols-2'>
      <section aria-label='Article card loading' className='min-w-0 space-y-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 max-w-full shrink-0 rounded-full' />
          <div className='min-w-0 flex-1 space-y-2'>
            <Skeleton className='h-3 w-28 max-w-full' />
            <Skeleton className='h-3 w-40 max-w-full' />
          </div>
        </div>
        <Skeleton className='h-8 w-4 max-w-full/5' />
        <div className='min-w-0 space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-11 max-w-full/12' />
          <Skeleton className='h-4 w-2 max-w-full/3' />
        </div>
      </section>

      <section aria-label='Table loading' className='min-w-0 space-y-3 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950'>
        <div className='grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_3.5rem] gap-3'>
          <Skeleton className='h-3 w-24 max-w-full' />
          <Skeleton className='h-3 w-20 max-w-full' />
          <Skeleton className='h-3 w-14 max-w-full' />
        </div>
        {[ 0, 1, 2, 3 ].map((row) => (
          <div key={ row } className='grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_3.5rem] gap-3 border-t border-gray-100 pt-3 dark:border-gray-800'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3 max-w-full/4' />
            <Skeleton className='h-6 w-14 max-w-full rounded-full' />
          </div>
        ))}
      </section>

      <section aria-label='Navigation loading' className='min-w-0 space-y-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950'>
        <div className='flex items-center justify-between gap-4'>
          <Skeleton className='h-9 w-9 max-w-full shrink-0' />
          <div className='grid min-w-0 flex-1 grid-cols-3 gap-3'>
            <Skeleton className='h-5 w-20 max-w-full' />
            <Skeleton className='h-5 w-16 max-w-full' />
            <Skeleton className='h-5 w-24 max-w-full' />
          </div>
        </div>
        <Skeleton className='h-10 w-full rounded-lg' />
      </section>

      <section aria-label='Media loading' className='min-w-0 space-y-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950'>
        <Skeleton className='aspect-video w-full rounded-lg' />
        <div className='min-w-0 space-y-2'>
          <Skeleton className='h-5 w-3 max-w-full/4' />
          <Skeleton className='h-4 w-1 max-w-full/2' />
        </div>
      </section>
    </div>
  )
};
