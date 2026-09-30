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
  CascaderTrigger
} from '../../../../src/components/core/Cascader/parts/cascader-extended.jsx';
import { CascaderItems } from '../../../../src/components/core/Cascader/parts/cascader-item-extended.jsx';
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
const topics = [
  {
    value: 'billing',
    label: 'Billing',
    children: [
      { value: 'billing.invoice', label: 'Invoice question' },
      { value: 'billing.refund', label: 'Refund request' },
      { value: 'billing.plan', label: 'Change plan' },
      { value: 'billing.tax', label: 'Tax details' }
    ]
  },
  {
    value: 'technical',
    label: 'Technical',
    children: [
      {
        value: 'technical.api',
        label: 'API',
        children: [
          { value: 'technical.api.auth', label: 'Authentication' },
          { value: 'technical.api.limits', label: 'Rate limits' },
          { value: 'technical.api.webhooks', label: 'Webhooks' }
        ]
      },
      { value: 'technical.bug', label: 'Bug report' },
      { value: 'technical.performance', label: 'Performance' }
    ]
  },
  {
    value: 'account',
    label: 'Account',
    children: [
      { value: 'account.login', label: 'Cannot sign in' },
      { value: 'account.email', label: 'Change email' },
      { value: 'account.delete', label: 'Delete account' }
    ]
  },
  {
    value: 'team',
    label: 'Team',
    children: [
      { value: 'team.invite', label: 'Invites' },
      { value: 'team.seats', label: 'Seats' },
      { value: 'team.roles', label: 'Roles' }
    ]
  },
  {
    value: 'licensing',
    label: 'Licensing',
    children: [
      { value: 'licensing.key', label: 'License key' },
      { value: 'licensing.transfer', label: 'Transfer a license' }
    ]
  },
  {
    value: 'security',
    label: 'Security',
    children: [
      { value: 'security.report', label: 'Report a vulnerability' },
      { value: 'security.sso', label: 'SSO setup' }
    ]
  },
  { value: 'feedback', label: 'Product feedback' },
  { value: 'other', label: 'Something else' }
];
export function Pattern() {
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
          <FieldLabel htmlFor='topic-trigger'>
            What do you need help with?
          </FieldLabel>
          <Cascader items={topics} name='topic'>
            <CascaderTrigger
              id='topic-trigger'
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
