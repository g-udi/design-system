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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const Icon = ({ name, className }) => <RegistryIcon lucide={name} aria-hidden='true' className={className} />;
// A primary action with its alternatives behind a chevron. `items` entries: [label, icon?, destructive?].
const solid = [
  { label: 'Save', menu: 'More save options', items: [['Save and publish'], ['Save as draft'], ['Save and exit']] },
  { label: 'Approve', icon: 'CheckIcon', menu: 'More approval options', items: [['Approve with conditions', 'CheckCircleIcon'], ['Request changes', 'MessageSquareIcon'], ['Reject', 'XIcon', true]] },
  { label: 'Execute', icon: 'PlayIcon', menu: 'More commit options', items: [['Commit and push'], ['Commit and sync'], ['Amend last commit']] }
];
function Menu({ label, items, heading, size = 'icon', variant, icon = 'ChevronDownIcon' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} aria-label={label}><Icon name={icon} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        <DropdownMenuGroup>
          {heading ? <DropdownMenuLabel>{heading}</DropdownMenuLabel> : null}
          {items.filter(([, , danger]) => !danger).map(([item, itemIcon]) => (
            <DropdownMenuItem key={item}>{itemIcon ? <Icon name={itemIcon} /> : null}{item}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {items.filter(([, , danger]) => danger).map(([item, itemIcon]) => (
          <DropdownMenuGroup key={item}>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'><Icon name={itemIcon} />{item}</DropdownMenuItem>
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function Row({ label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-text-muted'>{label}</span>
      <div className='flex flex-wrap items-center gap-2'>{children}</div>
    </div>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Row label='Solid'>
        {solid.map(({ label, icon, menu, items }) => (
          <ButtonGroup key={label} aria-label={label} className='**:data-[slot=button]:border-x-0'>
            <Button>{icon ? <Icon name={icon} /> : null}{label}</Button>
            <ButtonGroupSeparator className='bg-ui-primary-foreground/35' />
            <Menu label={menu} items={items} />
          </ButtonGroup>
        ))}
      </Row>
      <Row label='Outline'>
        <ButtonGroup aria-label='Deploy'>
          <Button variant='outline'>Update</Button>
          <Menu variant='outline' label='Choose environment' heading='Deploy to' items={[['Production'], ['Staging'], ['Development']]} />
        </ButtonGroup>
        <ButtonGroup aria-label='Create'>
          <Button variant='outline' size='sm'><Icon name='PlusIcon' />New</Button>
          <Menu variant='outline' size='icon-sm' icon='MoreHorizontalIcon' label='More create options' heading='Create' items={[['New customer', 'UserPlusIcon'], ['New order', 'ShoppingCartIcon'], ['New invoice', 'FileTextIcon']]} />
        </ButtonGroup>
        <ButtonGroup aria-label='Conversation'>
          <Button variant='outline'><Icon name='MessageCircleIcon' />Conversation</Button>
          <Menu
            variant='outline'
            icon='EllipsisVerticalIcon'
            label='More conversation actions'
            items={[['Mute conversation', 'VolumeXIcon'], ['Mark as read', 'CheckIcon'], ['Share conversation', 'UploadIcon'], ['Copy link', 'CopyIcon'], ['Block user', 'UserRoundXIcon'], ['Delete conversation', 'TrashIcon', true]]}
          />
        </ButtonGroup>
      </Row>
      <Row label='With a value'>
        <ButtonGroup aria-label='Payout balance'>
          <ButtonGroupText className='gap-1.5 rounded-md border border-border bg-surface-muted px-2.5 text-xs text-text-muted'>
            <Icon name='CreditCardIcon' className='size-3.5' />
            <span className='font-medium text-text tabular-nums'>USD 12,480</span>
          </ButtonGroupText>
          <Button variant='outline' size='sm'>Hold</Button>
        </ButtonGroup>
        <ButtonGroup aria-label='Release payout' className='**:data-[slot=button]:border-x-0'>
          <Button size='sm'><Icon name='CheckIcon' />Release</Button>
          <ButtonGroupSeparator className='bg-ui-primary-foreground/35' />
          <Menu size='icon-sm' label='More payout actions' items={[['Schedule for Friday', 'CalendarIcon'], ['Change destination', 'CreditCardIcon'], ['Export receipt', 'FileTextIcon'], ['Cancel payout', 'XIcon', true]]} />
        </ButtonGroup>
      </Row>
    </div>
  );
}
