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
  CascaderNav
} from '../../../../src/components/core/Cascader/parts/cascader-nav-extended.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const workflow = [
  {
    value: 'status',
    label: 'Status',
    children: [
      {
        value: 'status.backlog',
        label: 'Backlog',
        data: { dot: 'bg-slate-400 dark:bg-slate-500' }
      },
      {
        value: 'status.todo',
        label: 'Todo',
        data: { dot: 'bg-sky-500 dark:bg-sky-400' }
      },
      {
        value: 'status.in-progress',
        label: 'In progress',
        data: { dot: 'bg-amber-500 dark:bg-amber-400' }
      },
      {
        value: 'status.in-review',
        label: 'In review',
        data: { dot: 'bg-violet-500 dark:bg-violet-400' }
      },
      {
        value: 'status.done',
        label: 'Done',
        data: { dot: 'bg-emerald-500 dark:bg-emerald-400' }
      },
      {
        value: 'status.cancelled',
        label: 'Cancelled',
        data: { dot: 'bg-zinc-400 dark:bg-zinc-500' }
      }
    ]
  },
  {
    value: 'priority',
    label: 'Priority',
    children: [
      {
        value: 'priority.urgent',
        label: 'Urgent',
        data: { dot: 'bg-rose-500 dark:bg-rose-400', hint: 'Same day' }
      },
      {
        value: 'priority.high',
        label: 'High',
        data: { dot: 'bg-orange-500 dark:bg-orange-400', hint: 'This week' }
      },
      {
        value: 'priority.medium',
        label: 'Medium',
        data: { dot: 'bg-yellow-500 dark:bg-yellow-400', hint: 'This sprint' }
      },
      {
        value: 'priority.low',
        label: 'Low',
        data: { dot: 'bg-teal-500 dark:bg-teal-400', hint: 'When it fits' }
      },
      {
        value: 'priority.none',
        label: 'No priority',
        data: { dot: 'bg-slate-400 dark:bg-slate-500' }
      }
    ]
  },
  {
    value: 'type',
    label: 'Type',
    children: [
      {
        value: 'type.feature',
        label: 'Feature',
        data: { dot: 'bg-indigo-500 dark:bg-indigo-400' }
      },
      {
        value: 'type.bug',
        label: 'Bug',
        data: { dot: 'bg-red-500 dark:bg-red-400' }
      },
      {
        value: 'type.chore',
        label: 'Chore',
        data: { dot: 'bg-stone-400 dark:bg-stone-500' }
      },
      {
        value: 'type.docs',
        label: 'Documentation',
        data: { dot: 'bg-cyan-500 dark:bg-cyan-400' }
      }
    ]
  },
  {
    value: 'severity',
    label: 'Severity',
    children: [
      {
        value: 'severity.s1',
        label: 'S1 - outage',
        data: { dot: 'bg-rose-600 dark:bg-rose-400' }
      },
      {
        value: 'severity.s2',
        label: 'S2 - degraded',
        data: { dot: 'bg-orange-500 dark:bg-orange-400' }
      },
      {
        value: 'severity.s3',
        label: 'S3 - minor',
        data: { dot: 'bg-amber-500 dark:bg-amber-400' }
      },
      {
        value: 'severity.s4',
        label: 'S4 - cosmetic',
        data: { dot: 'bg-lime-500 dark:bg-lime-400' }
      }
    ]
  },
  {
    value: 'effort',
    label: 'Effort',
    children: [
      {
        value: 'effort.xs',
        label: 'XS',
        data: { dot: 'bg-emerald-500 dark:bg-emerald-400' }
      },
      {
        value: 'effort.s',
        label: 'S',
        data: { dot: 'bg-teal-500 dark:bg-teal-400' }
      },
      {
        value: 'effort.m',
        label: 'M',
        data: { dot: 'bg-sky-500 dark:bg-sky-400' }
      },
      {
        value: 'effort.l',
        label: 'L',
        data: { dot: 'bg-violet-500 dark:bg-violet-400' }
      },
      {
        value: 'effort.xl',
        label: 'XL',
        data: { dot: 'bg-fuchsia-500 dark:bg-fuchsia-400' }
      }
    ]
  },
  {
    value: 'stage',
    label: 'Release stage',
    children: [
      {
        value: 'stage.alpha',
        label: 'Alpha',
        data: { dot: 'bg-purple-500 dark:bg-purple-400' }
      },
      {
        value: 'stage.beta',
        label: 'Beta',
        data: { dot: 'bg-blue-500 dark:bg-blue-400' }
      },
      {
        value: 'stage.ga',
        label: 'General availability',
        data: { dot: 'bg-green-500 dark:bg-green-400' }
      }
    ]
  },
  {
    value: 'risk',
    label: 'Risk',
    children: [
      {
        value: 'risk.blocked',
        label: 'Blocked',
        data: { dot: 'bg-red-500 dark:bg-red-400' }
      },
      {
        value: 'risk.at-risk',
        label: 'At risk',
        data: { dot: 'bg-amber-500 dark:bg-amber-400' }
      },
      {
        value: 'risk.on-track',
        label: 'On track',
        data: { dot: 'bg-emerald-500 dark:bg-emerald-400' }
      }
    ]
  },
  {
    value: 'confidence',
    label: 'Confidence',
    children: [
      {
        value: 'confidence.high',
        label: 'High',
        data: { dot: 'bg-emerald-500 dark:bg-emerald-400' }
      },
      {
        value: 'confidence.medium',
        label: 'Medium',
        data: { dot: 'bg-yellow-500 dark:bg-yellow-400' }
      },
      {
        value: 'confidence.low',
        label: 'Low',
        data: { dot: 'bg-rose-500 dark:bg-rose-400' }
      }
    ]
  }
];
function WorkflowValue() {
  const { first, firstPath, isEmpty } = useCascaderSelection();
  if (isEmpty || !first) {
    return <span className='text-ui-muted-foreground'>Set a field</span>;
  }
  const group = firstPath[0];
  return (
    <span className='inline-flex min-w-0 items-center gap-2 leading-4'>
      <span
        aria-hidden='true'
        className={`size-2 shrink-0 rounded-full ${first.data?.dot}`}
      />
      <span className='min-w-0 truncate'>{first.label}</span>
      <span className='text-ui-muted-foreground truncate text-xs'>
        {group?.label}
      </span>
    </span>
  );
}
function ResetAction() {
  const { clear, isEmpty } = useCascaderSelection();
  return (
    <CascaderAction
      icon={<RegistryIcon lucide='RotateCcwIcon' className='size-4' />}
      disabled={isEmpty}
      onSelect={clear}
    >
      Reset selection
    </CascaderAction>
  );
}
export function Pattern() {
  const [value, setValue] = useState('');
  return (
    <div className='flex w-full justify-center p-4'>
      <Cascader
        items={workflow}
        value={value}
        onValueChange={setValue}
        renderLabel={(node, state) =>
          state.branch ? (
            <span className='w-full truncate text-start font-medium'>
              {node.label}
            </span>
          ) : (
            <span className='flex w-full min-w-0 items-center gap-2'>
              <span
                aria-hidden='true'
                className={`size-2 shrink-0 rounded-full ${node.data?.dot}`}
              />
              <span className='min-w-0 flex-1 truncate text-start'>
                {node.label}
              </span>
              {node.data?.hint ? (
                <span className='text-ui-muted-foreground shrink-0 text-xs'>
                  {node.data.hint}
                </span>
              ) : null}
            </span>
          )
        }
      >
        <div className='relative w-72'>
          <CascaderTrigger
            aria-label='Workflow field'
            showIcon={!value}
            render={
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-between gap-2 font-normal',
                  value && 'pe-8'
                )}
              />
            }
          >
            <WorkflowValue />
          </CascaderTrigger>

          {value ? (
            <Button
              variant='ghost'
              size='icon-xs'
              aria-label='Reset field'
              onClick={() => setValue('')}
              className='absolute end-1 top-1/2 -translate-y-1/2'
            >
              <RegistryIcon lucide='XIcon' />
            </Button>
          ) : null}
        </div>

        <CascaderContent className='w-72'>
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
              <ResetAction />
            </CascaderFooter>

            <CascaderStatus />
          </CascaderPanel>
        </CascaderContent>
      </Cascader>
    </div>
  );
}
