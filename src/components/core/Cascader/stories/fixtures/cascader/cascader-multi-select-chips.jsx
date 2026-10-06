'use client';
import { useState } from 'react';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderSelection
} from '@gaudi/design-system/core/Cascader';
import {
  CascaderAction,
  CascaderFooter,
  CascaderSubmenu,
  CascaderSubmenuContent,
  CascaderSubmenuTrigger,
  useCascaderSubmenu
} from '@gaudi/design-system/core/Cascader';
import {
  CascaderGroup,
  CascaderItems,
  CascaderLabel,
  CascaderSeparator
} from '@gaudi/design-system/core/Cascader';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '@gaudi/design-system/core/Cascader';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const billingIcon = <RegistryIcon lucide='CreditCardIcon' className='size-4' />;
const membersIcon = <RegistryIcon lucide='UsersIcon' className='size-4' />;
const projectsIcon = <RegistryIcon lucide='FolderIcon' className='size-4' />;
const deploymentsIcon = <RegistryIcon lucide='RocketIcon' className='size-4' />;
const domainsIcon = <RegistryIcon lucide='GlobeIcon' className='size-4' />;
const secretsIcon = <RegistryIcon lucide='KeyIcon' className='size-4' />;
const auditIcon = (
  <RegistryIcon lucide='ClipboardListIcon' className='size-4' />
);
const supportIcon = <RegistryIcon lucide='LifeBuoyIcon' className='size-4' />;
const viewIcon = <RegistryIcon lucide='EyeIcon' className='size-4' />;
const editIcon = <RegistryIcon lucide='PencilIcon' className='size-4' />;
const deleteIcon = <RegistryIcon lucide='Trash2Icon' className='size-4' />;
const exportIcon = <RegistryIcon lucide='DownloadIcon' className='size-4' />;
const inviteIcon = <RegistryIcon lucide='UserPlusIcon' className='size-4' />;
const removeMemberIcon = (
  <RegistryIcon lucide='UserMinusIcon' className='size-4' />
);
const roleIcon = <RegistryIcon lucide='UserRoundCogIcon' className='size-4' />;
const subscriptionIcon = (
  <RegistryIcon lucide='RepeatIcon' className='size-4' />
);
const refundIcon = <RegistryIcon lucide='BanknoteIcon' className='size-4' />;
const transferIcon = (
  <RegistryIcon lucide='ArrowLeftRightIcon' className='size-4' />
);
const promoteIcon = (
  <RegistryIcon lucide='CloudUploadIcon' className='size-4' />
);
const rollbackIcon = <RegistryIcon lucide='RotateCcwIcon' className='size-4' />;
const attachIcon = <RegistryIcon lucide='LinkIcon' className='size-4' />;
const certificateIcon = (
  <RegistryIcon lucide='ShieldCheckIcon' className='size-4' />
);
const rotateIcon = <RegistryIcon lucide='RefreshCwIcon' className='size-4' />;
const replyIcon = <RegistryIcon lucide='CornerUpLeftIcon' className='size-4' />;
const clearIcon = <RegistryIcon lucide='CircleXIcon' className='size-4' />;
const presetIcon = <RegistryIcon lucide='CopyIcon' className='size-4' />;
const presetRoleIcon = <RegistryIcon lucide='ShieldIcon' className='size-4' />;
const teamIcon = <RegistryIcon lucide='UsersRoundIcon' className='size-4' />;
const MAX = 5;
// Presets fill the selection in one step from the footer flyout.
const presets = {
  roles: [
    { label: 'Viewer', value: ['billing.read', 'members.read', 'projects.read', 'deployments.read', 'audit.read'] },
    { label: 'Developer', value: ['projects.read', 'projects.write', 'deployments.read', 'deployments.ship', 'secrets.read'] },
    { label: 'Billing admin', value: ['billing.read', 'billing.write', 'billing.refund', 'billing.tax', 'audit.export'] }
  ],
  teams: [
    { label: 'Support', value: ['support.read', 'support.reply', 'members.read'] },
    { label: 'Platform', value: ['deployments.ship', 'deployments.rollback', 'domains.certs', 'secrets.write'] }
  ]
};
const permissions = [
  {
    value: 'billing',
    label: 'Billing',
    icon: billingIcon,
    children: [
      { value: 'billing.read', label: 'View invoices', icon: viewIcon },
      {
        value: 'billing.write',
        label: 'Manage subscription',
        icon: subscriptionIcon
      },
      { value: 'billing.refund', label: 'Issue refunds', icon: refundIcon },
      { value: 'billing.tax', label: 'Update billing address', icon: editIcon }
    ]
  },
  {
    value: 'members',
    label: 'Members',
    icon: membersIcon,
    children: [
      { value: 'members.read', label: 'View members', icon: viewIcon },
      { value: 'members.invite', label: 'Invite members', icon: inviteIcon },
      {
        value: 'members.remove',
        label: 'Remove members',
        icon: removeMemberIcon
      },
      { value: 'members.roles', label: 'Assign roles', icon: roleIcon }
    ]
  },
  {
    value: 'projects',
    label: 'Projects',
    icon: projectsIcon,
    children: [
      { value: 'projects.read', label: 'View projects', icon: viewIcon },
      { value: 'projects.write', label: 'Edit projects', icon: editIcon },
      {
        value: 'projects.transfer',
        label: 'Transfer projects',
        icon: transferIcon
      },
      {
        value: 'projects.delete',
        label: 'Delete projects',
        icon: deleteIcon,
        disabled: true
      }
    ]
  },
  {
    value: 'deployments',
    label: 'Deployments',
    icon: deploymentsIcon,
    children: [
      { value: 'deployments.read', label: 'View deployments', icon: viewIcon },
      {
        value: 'deployments.ship',
        label: 'Publish to the live site',
        icon: promoteIcon
      },
      { value: 'deployments.rollback', label: 'Roll back', icon: rollbackIcon }
    ]
  },
  {
    value: 'domains',
    label: 'Domains',
    icon: domainsIcon,
    children: [
      { value: 'domains.read', label: 'View domains', icon: viewIcon },
      { value: 'domains.attach', label: 'Attach a domain', icon: attachIcon },
      {
        value: 'domains.certs',
        label: 'Manage certificates',
        icon: certificateIcon
      }
    ]
  },
  {
    value: 'secrets',
    label: 'Secrets',
    icon: secretsIcon,
    children: [
      { value: 'secrets.read', label: 'Read secrets', icon: viewIcon },
      { value: 'secrets.write', label: 'Rotate secrets', icon: rotateIcon }
    ]
  },
  {
    value: 'audit',
    label: 'Audit log',
    icon: auditIcon,
    children: [
      { value: 'audit.read', label: 'View the activity log', icon: viewIcon },
      {
        value: 'audit.export',
        label: 'Download the activity log',
        icon: exportIcon
      }
    ]
  },
  {
    value: 'support',
    label: 'Support',
    icon: supportIcon,
    children: [
      { value: 'support.read', label: 'View tickets', icon: viewIcon },
      { value: 'support.reply', label: 'Answer tickets', icon: replyIcon }
    ]
  }
];
function ClearAction() {
  const { clear, isEmpty } = useCascaderSelection();
  return (
    <CascaderAction icon={clearIcon} disabled={isEmpty} onSelect={clear}>
      Clear selection
    </CascaderAction>
  );
}
function PresetMenu({ onApply }) {
  const { close } = useCascaderSubmenu();
  const apply = (value) => () => {
    onApply(value);
    close();
  };
  return (
    <>
      <CascaderGroup className='gap-0.5'>
        <CascaderLabel>Roles</CascaderLabel>
        {presets.roles.map((preset) => (
          <CascaderAction key={preset.label} icon={presetRoleIcon} onSelect={apply(preset.value)}>
            {preset.label}
          </CascaderAction>
        ))}
      </CascaderGroup>
      <CascaderSeparator />
      <CascaderGroup className='gap-0.5'>
        <CascaderLabel>Teams</CascaderLabel>
        {presets.teams.map((preset) => (
          <CascaderAction key={preset.label} icon={teamIcon} onSelect={apply(preset.value)}>
            {preset.label}
          </CascaderAction>
        ))}
      </CascaderGroup>
    </>
  );
}
// Chips live outside the popup and read the selection from context. Each carries its full path, so two
// leaves with the same name in different branches stay distinct.
function PermissionChips() {
  const { paths, isEmpty, remove } = useCascaderSelection();
  if (isEmpty) {
    return <p className='text-xs text-ui-muted-foreground'>No permissions yet. Pick up to {MAX}.</p>;
  }
  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {paths.map((path) => {
        const node = path[path.length - 1];
        if (!node) return null;
        const label = path.map((ancestor) => ancestor.label).join(' / ');
        return (
          <Badge key={node.value} variant='secondary' className='gap-0.5'>
            {label}
            <Button
              variant='ghost'
              size='icon'
              aria-label={`Remove ${label}`}
              onClick={() => remove(node.value)}
              className='size-3 hover:bg-transparent'
            >
              <RegistryIcon lucide='XIcon' />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
}
export function Pattern() {
  const [value, setValue] = useState([]);
  const hasSelection = value.length > 0;
  return (
    <div className='flex w-full justify-center p-4'>
      <div className='flex w-full max-w-sm flex-col gap-2'>
        <Cascader
          multiple
          max={MAX}
          items={permissions}
          value={value}
          onValueChange={setValue}
        >
          <div className='relative w-full'>
            <CascaderTrigger
              aria-label='Permissions'
              showIcon={!hasSelection}
              render={
                <Button
                  variant='outline'
                  className={cn(
                    /* `transition-colors`, not `transition-all`: the clear gutter toggles `pe-8`, and
                       animating the padding would slide the label under the vanishing button. */
                    'w-full justify-between gap-2 font-normal transition-colors',
                    hasSelection && 'pe-8'
                  )}
                />
              }
            >
              <CascaderValue placeholder='Select permissions' display='count' />
            </CascaderTrigger>
            {hasSelection ? (
              <Button
                variant='ghost'
                size='icon-xs'
                aria-label='Remove every permission'
                onClick={() => setValue([])}
                className='absolute end-1 top-1/2 -translate-y-1/2 transition-none'
              >
                <RegistryIcon lucide='XIcon' />
              </Button>
            ) : null}
          </div>
          <CascaderContent className='w-80'>
            <CascaderPanel>
              <CascaderNav>
                <CascaderInput />
              </CascaderNav>
              <CascaderBreadcrumb />
              <CascaderEmpty />
              <CascaderList>
                <CascaderItems />
              </CascaderList>
              {/* A sibling of the list, never a child: the list's Enter handler clicks whatever it
                  contains, so a command inside the rows would fire on the keystroke that commits one. */}
              <CascaderFooter>
                <CascaderSubmenu>
                  <CascaderSubmenuTrigger icon={presetIcon}>Start from a preset</CascaderSubmenuTrigger>
                  <CascaderSubmenuContent>
                    <PresetMenu onApply={setValue} />
                  </CascaderSubmenuContent>
                </CascaderSubmenu>
                <ClearAction />
              </CascaderFooter>
              <CascaderStatus />
            </CascaderPanel>
          </CascaderContent>
          <PermissionChips />
        </Cascader>
      </div>
    </div>
  );
}
