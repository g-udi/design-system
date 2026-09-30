// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-fit gap-2'>
            <RegistryIcon lucide='Share2Icon' aria-hidden='true' />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-48' align='start'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Share via</DropdownMenuLabel>
            <DropdownMenuItem>
              <RegistryIcon lucide='MailIcon' aria-hidden='true' />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='MessageCircleIcon' aria-hidden='true' />
              Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='LinkIcon' aria-hidden='true' />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Export as</DropdownMenuLabel>
            <DropdownMenuItem>
              <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='FileSpreadsheetIcon' aria-hidden='true' />
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='ImageIcon' aria-hidden='true' />
              PNG
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <RegistryIcon lucide='PrinterIcon' aria-hidden='true' />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
