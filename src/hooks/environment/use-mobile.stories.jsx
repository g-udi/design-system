import Button from '../../components/core/Button';
import Card from '../../components/core/Card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../../components/core/Sheet';
import { example, hookMeta, Readout, Value } from '../story-helpers.jsx';
import { MOBILE_BREAKPOINT, useIsMobile } from './use-mobile.js';

export default {
  title: 'Hooks/Environment/useIsMobile',
  id: 'hooks-environment-useismobile',
  tags: ['autodocs'],
  ...hookMeta('useIsMobile')
};

const Filters = () => (
  <ul className='grid gap-1 text-sm'>
    <li>Design</li>
    <li>Engineering</li>
    <li>Writing</li>
  </ul>
);

function ResponsiveFilters() {
  const isMobile = useIsMobile();
  return (
    <div className='grid gap-3'>
      <Readout label={`Below ${MOBILE_BREAKPOINT}px`}><Value>{isMobile}</Value></Readout>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild><Button variant='outline' tone='neutral' className='w-fit'>Filters</Button></SheetTrigger>
          <SheetContent side='bottom'>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow the post list.</SheetDescription>
            </SheetHeader>
            <div className='p-4'><Filters /></div>
          </SheetContent>
        </Sheet>
      ) : (
        <Card variant='outline' padding='sm' title='Filters' titleLevel={4}><Filters /></Card>
      )}
    </div>
  );
}

export const FiltersPanel = {
  name: 'Sidebar or sheet',
  parameters: example('On phones the filters move into a bottom Sheet; on wider screens they sit in the page. Both layouts reach the same filters. Try it at a narrow width.', `
import { Button, Card, Sheet, SheetContent, SheetTitle, SheetTrigger } from '@gaudi/design-system';
import { useIsMobile } from '@gaudi/design-system/hooks';

export function PostFilters() {
  const isMobile = useIsMobile();
  if (!isMobile) return <Card title='Filters'><Filters /></Card>;
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant='outline'>Filters</Button></SheetTrigger>
      <SheetContent side='bottom'><SheetTitle>Filters</SheetTitle><Filters /></SheetContent>
    </Sheet>
  );
}`),
  render: () => <ResponsiveFilters />
};
