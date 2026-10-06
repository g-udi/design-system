'use client';

import { useId, useRef } from 'react';
import { cn } from '../../../utilities/cn/index.js';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { useIsomorphicLayoutEffect } from '../../../hooks/state/use-isomorphic-layout-effect.js';
import Button from '../../core/Button/index.js';
import Avatar from '../../core/Avatar/index.js';
import Icon from '../../core/Icon/index.js';
import EmptyState from '../../core/EmptyState/index.js';

const defaultLabels = {
  empty: 'No people to display',
  expand: (node) => `Show reports for ${node.name}`,
  collapse: (node) => `Hide reports for ${node.name}`,
  reports: (count) => `${count} direct ${count === 1 ? 'report' : 'reports'}`
};

function OrgBranch({ node, collapsed, toggle, onNodeClick, disabled, labels, renderNode }) {
  const childId = useId();
  const children = node.children || [];
  const expanded = !collapsed.includes(node.id);
  const content = renderNode ? renderNode(node) : (
    <>
      <Avatar name={node.name} src={node.avatar} size='sm' surface='tinted' aria-hidden='true' />
      <span className='min-w-0'>
        <span className='block font-medium wrap-anywhere'>{node.name}</span>
        {node.role && <span className='block text-xs text-text-muted wrap-anywhere'>{node.role}</span>}
        {node.department && <span className='mt-1 block text-xs text-text-muted wrap-anywhere'>{node.department}</span>}
      </span>
    </>
  );

  return (
    <li className='ds-org-branch'>
      <div className='ds-org-card' data-slot='org-chart-node' data-node-id={node.id}>
        {onNodeClick ? (
          <Button variant='ghost' disabled={disabled} onClick={() => onNodeClick(node)} className='ds-org-person' aria-label={node.name}>
            {content}
          </Button>
        ) : <div className='ds-org-person'>{content}</div>}
        {children.length > 0 && (
          <Button
            variant='ghost' size='sm' disabled={disabled} className='ds-org-toggle'
            aria-label={(expanded ? labels.collapse : labels.expand)(node)}
            aria-expanded={expanded} aria-controls={expanded ? childId : undefined}
            onClick={() => toggle(node.id)}
          >
            {labels.reports(children.length)}
            <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} decorative />
          </Button>
        )}
      </div>
      {children.length > 0 && expanded && (
        <ul id={childId} className='ds-org-level' aria-label={labels.reports(children.length)}>
          {children.map((child) => <OrgBranch key={child.id} node={child} collapsed={collapsed} toggle={toggle} onNodeClick={onNodeClick} disabled={disabled} labels={labels} renderNode={renderNode} />)}
        </ul>
      )}
    </li>
  );
}

/** A reporting hierarchy with readable cards, semantic nested lists and collapsible branches. */
export function OrgChart({ data, label = 'Organization chart', collapsedIds, defaultCollapsedIds = [], onCollapsedIdsChange, onNodeClick, renderNode, disabled = false, labels: suppliedLabels, className, ...props }) {
  const viewport = useRef(null);
  const [collapsed, setCollapsed] = useControllableState({ value: collapsedIds, defaultValue: defaultCollapsedIds, onChange: onCollapsedIdsChange });
  const labels = { ...defaultLabels, ...suppliedLabels };
  const toggle = (id) => setCollapsed((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  useIsomorphicLayoutEffect(() => {
    const element = viewport.current;
    if (element) element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2;
  }, [data?.id]);

  return (
    <div {...props} ref={viewport} className={cn('ds-org-chart', className)} role='region' aria-label={label} tabIndex={0} data-slot='org-chart'>
      {data ? (
        <ul className='ds-org-level ds-org-root'>
          <OrgBranch node={data} collapsed={collapsed} toggle={toggle} onNodeClick={onNodeClick} disabled={disabled} labels={labels} renderNode={renderNode} />
        </ul>
      ) : <EmptyState compact title={labels.empty} />}
    </div>
  );
}
