import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='max-w-3xl'>
      <InputGroup className='bg-ui-background rounded-full h-14 border p-1.5'>
        <InputGroupAddon className='border-none pl-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                aria-label='Add'
                variant='ghost'
                size='icon-sm'
                className='text-ui-muted-foreground hover:text-ui-foreground rounded-full size-10'
              >
                <RegistryIcon lucide='PlusIcon' className='size-6' />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side='top'
              align='start'
              sideOffset={12}
              className='w-56'
            >
              <DropdownMenuItem>
                <RegistryIcon lucide='PaperclipIcon' />
                <span>Add photos & files</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className='-mx-3' />
              <DropdownMenuItem>
                <RegistryIcon lucide='ImageIcon' />
                <span>Create image</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='BrainIcon' />
                <span>Thinking</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='SearchIcon' />
                <span>Deep research</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon lucide='ShoppingBagIcon' />
                <span>Shopping research</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <RegistryIcon lucide='SparklesIcon' />
                  <span>More</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className='w-44'>
                  <DropdownMenuItem>
                    <RegistryIcon lucide='BookOpenIcon' />
                    <span>Study and learn</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RegistryIcon lucide='GlobeIcon' />
                    <span>Web search</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RegistryIcon lucide='LayoutDashboardIcon' />
                    <span>Canvas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RegistryIcon lucide='AppWindowIcon' />
                    <span>Explore apps</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>

        <InputGroupInput
          aria-label='Ask anything'
          placeholder='Ask anything'
          className='placeholder:text-ui-muted-foreground border-none px-2 text-lg shadow-none focus-visible:ring-0'
        />

        <InputGroupAddon align='inline-end' className='gap-2 border-none pr-1'>
          <InputGroupButton
            aria-label='Use microphone'
            variant='ghost'
            className='text-ui-muted-foreground hover:text-ui-foreground rounded-full size-11'
          >
            <RegistryIcon lucide='MicIcon' className='size-5' />
          </InputGroupButton>
          <InputGroupButton
            aria-label='Start voice chat'
            variant='default'
            className='rounded-full size-11 bg-black text-white hover:bg-black/90'
          >
            <RegistryIcon lucide='AudioLinesIcon' className='size-5' />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
