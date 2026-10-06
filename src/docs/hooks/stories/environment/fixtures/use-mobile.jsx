import Button from '../../../../../components/core/Button';
import Card from '../../../../../components/core/Card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../../../../../components/core/Sheet';
import { Readout, Value } from '../../fixtures/HookReadouts.jsx';
import { MOBILE_BREAKPOINT, useIsMobile } from '../../../../../hooks/environment/use-mobile.js';

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

export { Filters, ResponsiveFilters };
