// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../../../../src/components/core/Accordion/Accordion.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='mx-auto mb-auto w-full max-w-lg'>
      <Accordion
        type='single'
        collapsible
        defaultValue='pos-app'
        className='border-ui-border rounded-lg overflow-hidden border'
      >
        {/* Step 1: Completed */}
        <AccordionItem value='add-products' className='bg-transparent px-4'>
          <AccordionTrigger className='items-center py-4 font-semibold hover:no-underline'>
            <div className='flex w-full items-center justify-between pr-4'>
              <div className='flex items-center justify-center gap-3'>
                <div className='flex size-5 items-center justify-center'>
                  <RegistryIcon
                    lucide='CircleCheckIcon'
                    className='fill-success text-ui-background size-5'
                  />
                </div>
                <span className='text-sm font-medium'>Add products</span>
              </div>
              <Badge variant='success-light'>Ready</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className='text-ui-muted-foreground pr-0 pb-4 pl-8 leading-relaxed'>
            Your products have been successfully added and are ready for sale.
          </AccordionContent>
        </AccordionItem>

        {/* Step 2: Expanded/In Progress */}
        <AccordionItem value='pos-app' className='bg-transparent px-4'>
          <AccordionTrigger className='items-center py-4 font-semibold hover:no-underline'>
            <div className='flex w-full items-center justify-between pr-4'>
              <div className='flex items-center gap-3'>
                <div className='flex size-5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950'>
                  <div className='size-2 rounded-full bg-yellow-500' />
                </div>
                <span className='text-ui-foreground text-sm font-medium'>
                  Get the point of sale application
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className='pt-2 pl-8'>
            <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
              <div className='flex-1 space-y-6'>
                <p className='text-ui-muted-foreground text-sm leading-relaxed'>
                  Scan the QR code or send yourself the link to get the app. The
                  mobile app is where you&apos;ll manage orders, track
                  inventory, and view analytics on the go.
                </p>
                <ButtonGroup>
                  <Input
                    aria-label='james@alignui.com'
                    placeholder='james@alignui.com'
                  />
                  <Button variant='outline' aria-label='Send link'>
                    Send link
                  </Button>
                </ButtonGroup>
              </div>
              <div className='bg-ui-muted/30 border-ui-border rounded-lg flex shrink-0 items-center justify-center border p-3'>
                <RegistryIcon
                  lucide='QrCodeIcon'
                  className='size-20'
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Step 3: Pending */}
        <AccordionItem value='price-stock' className='bg-transparent px-4'>
          <AccordionTrigger className='items-center py-4 font-semibold hover:no-underline'>
            <div className='flex w-full items-center justify-between pr-4'>
              <div className='flex items-center gap-3'>
                <div className='flex size-5 items-center justify-center'>
                  <Spinner className='opacity-60' />
                </div>
                <span className='text-ui-muted-foreground text-sm font-medium'>
                  Product price & stock
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className='text-ui-muted-foreground pl-8 text-sm leading-relaxed'>
            Configure your product pricing and manage stock levels across all
            locations.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
