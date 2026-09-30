import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center gap-2'>
      <ButtonGroup>
        <ButtonGroupText className='border-ui-input bg-ui-muted/40 text-ui-muted-foreground gap-1.5 border px-2.5 text-xs'>
          <RegistryIcon
            lucide='CreditCardIcon'
            className='size-3.5 opacity-60'
            aria-hidden='true'
          />
          <span className='text-ui-foreground font-medium tabular-nums'>
            USD 12,480
          </span>
        </ButtonGroupText>
        <Button variant='outline' size='sm'>
          Hold
        </Button>
      </ButtonGroup>

      <ButtonGroup className='**:data-[slot=button]:border-r-0'>
        <Button size='sm'>
          <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
          Release
        </Button>
        <ButtonGroupSeparator className='bg-ui-primary/72' />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='icon-sm'
              className='border-ui-primary-foreground/20 rounded-l-none border-l'
              aria-label='More payout actions'
            >
              <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' sideOffset={8} className='w-44'>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='CalendarIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                Schedule for Friday
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='CreditCardIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                Change destination
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='FileTextIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                Export receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive'>
                <RegistryIcon lucide='XIcon' aria-hidden='true' />
                Cancel payout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </div>
  );
}
