// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '../../../../src/components/core/CmdLauncher/parts/command.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs p-0'>
      <CardContent className='p-0'>
        {/* Inline palettes wait for keyboard or search input before selecting an item.
            This also prevents cmdk's initial selection from scrolling the host page. */}
        <Command defaultValue='__unselected__'>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Suggestions'>
              <CommandItem>
                <RegistryIcon lucide='CalendarIcon' />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='SmileIcon' />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem disabled>
                <RegistryIcon lucide='CalculatorIcon' />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Settings'>
              <CommandItem>
                <RegistryIcon lucide='UserIcon' />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='CreditCardIcon' />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='SettingsIcon' />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>
    </Card>
  );
}
