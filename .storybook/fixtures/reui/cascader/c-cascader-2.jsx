// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import {
  CascaderAction,
  CascaderFooter
} from '../../../../src/components/core/Cascader/parts/cascader-footer-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
      { value: 'billing.tax', label: 'Edit tax details', icon: editIcon }
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
        label: 'Promote to production',
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
      { value: 'audit.read', label: 'Read the audit log', icon: viewIcon },
      {
        value: 'audit.export',
        label: 'Export the audit log',
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
      { value: 'support.reply', label: 'Reply to tickets', icon: replyIcon }
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
export function Pattern() {
  const [value, setValue] = useState([]);
  const hasSelection = value.length > 0;
  return (
    <div className='flex w-full justify-center p-4'>
      <Cascader
        multiple
        max={5}
        items={permissions}
        value={value}
        onValueChange={setValue}
      >
        <div className='relative w-72'>
          <CascaderTrigger
            aria-label='Permissions'
            showIcon={!hasSelection}
            render={
              <Button
                variant='outline'
                className={cn(
                  /* `transition-colors`, not the Button's own `transition-all`:
           the gutter below toggles `pe-8`, and `all` animates that
           padding over 150ms, so clearing slid the label and chevron
           sideways under the vanishing clear button. Colour still
           eases for hover and focus. */
                  'w-full justify-between gap-2 font-normal transition-colors',
                  hasSelection && 'pe-8'
                )}
              />
            }
          >
            <CascaderValue placeholder='Select permissions' />
          </CascaderTrigger>

          {hasSelection ? (
            <Button
              variant='ghost'
              size='icon-xs'
              aria-label='Clear all permissions'
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

            {/* A SIBLING of the list, never a child of it: `CascaderList`'s own
       Enter handler clicks whatever it contains, so a command living
       inside the rows would fire on the keystroke that commits one. */}
            <CascaderFooter>
              <ClearAction />
            </CascaderFooter>

            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  );
}
