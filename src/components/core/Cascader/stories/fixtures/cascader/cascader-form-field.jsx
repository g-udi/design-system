'use client';
import { useId, useState } from 'react';
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger
} from '@gaudi/design-system/core/Cascader';
import { CascaderItems } from '@gaudi/design-system/core/Cascader';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '@gaudi/design-system/core/Cascader';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  FieldRoot as Field,
  FieldDescriptionPrimitive as FieldDescription,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
// Flat rows, as they come from a database table: `getParent` rebuilds the tree, in any row order.
const topics = [
  { value: 'billing', label: 'Billing', parentId: null },
  { value: 'billing.invoice', label: 'Invoice question', parentId: 'billing' },
  { value: 'billing.refund', label: 'Refund request', parentId: 'billing' },
  { value: 'billing.plan', label: 'Change plan', parentId: 'billing' },
  { value: 'billing.tax', label: 'Tax details', parentId: 'billing' },
  { value: 'technical.api.auth', label: 'Authentication', parentId: 'technical.api' },
  { value: 'technical', label: 'Technical', parentId: null },
  { value: 'technical.api', label: 'API', parentId: 'technical' },
  { value: 'technical.api.limits', label: 'Rate limits', parentId: 'technical.api' },
  { value: 'technical.api.webhooks', label: 'Webhooks', parentId: 'technical.api' },
  { value: 'technical.bug', label: 'Bug report', parentId: 'technical' },
  { value: 'technical.performance', label: 'Performance', parentId: 'technical' },
  { value: 'account', label: 'Account', parentId: null },
  { value: 'account.login', label: 'Cannot sign in', parentId: 'account' },
  { value: 'account.email', label: 'Change email', parentId: 'account' },
  { value: 'account.delete', label: 'Delete account', parentId: 'account' },
  { value: 'team.invite', label: 'Invites', parentId: 'team' },
  { value: 'team', label: 'Team', parentId: null },
  { value: 'team.seats', label: 'Seats', parentId: 'team' },
  { value: 'team.roles', label: 'Roles', parentId: 'team' },
  { value: 'licensing', label: 'Licensing', parentId: null },
  { value: 'licensing.key', label: 'License key', parentId: 'licensing' },
  { value: 'licensing.transfer', label: 'Transfer a license', parentId: 'licensing' },
  { value: 'security', label: 'Security', parentId: null },
  { value: 'security.report', label: 'Report a vulnerability', parentId: 'security' },
  { value: 'security.sso', label: 'SSO setup', parentId: 'security' },
  { value: 'feedback', label: 'Product feedback', parentId: null },
  { value: 'other', label: 'Something else', parentId: null }
];
export function Pattern() {
  const fieldId = useId();
  const [submitted, setSubmitted] = useState(null);
  return (
    <div className='flex w-full justify-center p-4'>
      <form
        className='flex w-full max-w-sm flex-col gap-4'
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setSubmitted(String(data.get('topic') ?? ''));
        }}
      >
        <Field>
          <FieldLabel htmlFor={fieldId}>
            What do you need help with?
          </FieldLabel>
          <Cascader items={topics} getParent={(node) => node.parentId} name='topic'>
            <CascaderTrigger
              id={fieldId}
              render={
                <Button
                  variant='outline'
                  className='w-full justify-between gap-2 font-normal'
                />
              }
            >
              <CascaderValue placeholder='Select a topic' />
            </CascaderTrigger>

            <CascaderContent className='w-(--anchor-width)'>
              <CascaderPanel>
                <CascaderNav>
                  <CascaderInput />
                </CascaderNav>
                <CascaderBreadcrumb />
                <CascaderEmpty />
                <CascaderList>
                  <CascaderItems />
                </CascaderList>
                <CascaderStatus />
              </CascaderPanel>
            </CascaderContent>
          </Cascader>
          <FieldDescription>
            Pick the most specific topic you can.
          </FieldDescription>
        </Field>

        <Button type='submit' className='w-full'>
          Submit request
        </Button>

        {submitted ? (
          <p className='text-ui-muted-foreground text-xs'>
            Submitted{' '}
            <code className='text-ui-foreground'>topic={submitted}</code>
          </p>
        ) : null}
      </form>
    </div>
  );
}
