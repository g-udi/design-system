// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../../../src/components/core/Popover/parts/popover.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex min-h-[100px] items-center justify-center'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' className='gap-2'>
            <RegistryIcon lucide='SparklesIcon' />
            AI Assistant
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-80 gap-0 overflow-hidden p-0'
          align='center'
        >
          <div className='bg-ui-primary/5 border-ui-primary/10 border-b p-2'>
            <div className='text-ui-primary flex items-center gap-2 font-semibold'>
              <RegistryIcon lucide='SparklesIcon' className='size-4' />
              <span>Smart Suggestions</span>
            </div>
          </div>
          <div className='space-y-3 p-2'>
            <p className='text-ui-muted-foreground leading-relaxed'>
              Our AI analyzes your workflow to provide tailored recommendations.
              It helps you automate repetitive tasks and optimizes your design
              process in real-time.
            </p>
            <div className='grid grid-cols-2 items-center gap-2'>
              <Button size='sm'>Enable AI</Button>
              <Button size='sm' variant='outline'>
                Learn more
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
