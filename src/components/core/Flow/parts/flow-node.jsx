'use client';

import { Handle, NodeToolbar, Position } from '@xyflow/react';
import { default as Avatar } from '../../Avatar/index.js';
import { default as Button } from '../../Button/index.js';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../Card/parts/card.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../DropdownMenu/parts/dropdown-menu.jsx';
import { default as Icon } from '../../Icon/index.js';
import { IconTile } from '../../Icon/parts/icon-tile-extended.jsx';
import { Badge } from '../../Pill/parts/badge-extended.jsx';
import { cn } from '../../../../utilities/cn/index.js';

/** Run states a node can show. Each maps to a Badge variant and a registry icon. */
export const FLOW_STATUSES = {
  idle: { label: 'Idle', badge: 'secondary', icon: 'CircleDashed' },
  queued: { label: 'Queued', badge: 'outline', icon: 'Clock' },
  running: { label: 'Running', badge: 'info-light', icon: 'RefreshCw' },
  success: { label: 'Passed', badge: 'success-light', icon: 'CircleCheck' },
  failed: { label: 'Failed', badge: 'destructive-light', icon: 'CircleX' },
  waiting: { label: 'Waiting', badge: 'warning-light', icon: 'Hourglass' },
  blocked: { label: 'Blocked', badge: 'attention-light', icon: 'Lock' },
  skipped: { label: 'Skipped', badge: 'secondary', icon: 'Minus' }
};

/** Icon tile tints, matching the semantic tones used across Gaudi. */
const toneText = {
  neutral: 'text-text-muted',
  accent: 'text-accent',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  discovery: 'text-discovery',
  attention: 'text-attention'
};

const sides = { top: Position.Top, right: Position.Right, bottom: Position.Bottom, left: Position.Left };
const asPosition = (value, fallback) => sides[value] || value || fallback;
const horizontal = (position) => position === Position.Left || position === Position.Right;

/** A status badge on its own, for node toolbars, inspectors and lists beside the canvas. */
export function FlowStatus({ status, label, className }) {
  const entry = FLOW_STATUSES[status];
  if (!entry) return null;
  return (
    <Badge variant={entry.badge} size='sm' data-status={status} className={cn('ds-flow-status', className)}>
      <Icon name={entry.icon} decorative size='xs' className={status === 'running' ? 'motion-safe:animate-spin' : undefined} />
      {label || entry.label}
    </Badge>
  );
}

/**
 * Spreads several source handles (such as Yes / No branches) along one side, each with
 * its own id and a visible label so the branch reads without hovering.
 */
function Outputs({ outputs, position, connectable }) {
  const across = horizontal(position) ? 'top' : 'left';
  return outputs.map((output, index) => {
    const offset = `${((index + 1) / (outputs.length + 1)) * 100}%`;
    return (
      <Handle
        key={output.id}
        id={output.id}
        type='source'
        position={position}
        isConnectable={connectable}
        className='ds-flow-handle'
        style={{ [across]: offset }}
      >
        {output.label && <span className='ds-flow-handle-label' data-side={position}>{output.label}</span>}
      </Handle>
    );
  });
}

/** Extra ports, such as model or test attachments, drawn as hollow handles on any side. */
function Ports({ ports, connectable }) {
  const groups = {};
  for (const port of ports) (groups[port.position || 'bottom'] ||= []).push(port);
  return Object.entries(groups).flatMap(([side, list]) => list.map((port, index) => {
    const position = asPosition(side, Position.Bottom);
    const across = horizontal(position) ? 'top' : 'left';
    return (
      <Handle
        key={port.id}
        id={port.id}
        type={port.type || 'source'}
        position={position}
        isConnectable={connectable}
        className='ds-flow-handle'
        data-port='true'
        style={{ [across]: `${((index + 1) / (list.length + 1)) * 100}%` }}
      />
    );
  }));
}

/**
 * The default `step` node: an icon tile, title and description, a run status, facts
 * such as duration or cost, an owner, optional progress, an actions menu, and handles
 * on the sides the layout direction implies. Everything comes from `node.data`.
 */
export function FlowNode({ id, data = {}, selected, targetPosition = Position.Top, sourcePosition = Position.Bottom, isConnectable = true }) {
  const {
    title,
    description,
    icon,
    tone = 'neutral',
    status,
    statusLabel,
    badge,
    meta = [],
    owner,
    progress,
    progressLabel,
    actions = [],
    actionsLabel,
    footer,
    content,
    outputs,
    ports = [],
    target = true,
    source = true,
    width,
    toolbar,
    emphasis
  } = data;
  const facts = meta.filter((item) => item != null && item !== '');
  const percent = progress == null ? null : Math.max(0, Math.min(100, Number(progress)));
  return (
    <>
      {toolbar && (
        <NodeToolbar isVisible={selected} position={Position.Top} className='ds-flow-node-toolbar nodrag nopan'>
          {toolbar}
        </NodeToolbar>
      )}
      <Card
        size='sm'
        data-slot='flow-node'
        data-status={status}
        data-emphasis={emphasis || undefined}
        data-selected={selected || undefined}
        className='ds-flow-node'
        style={width ? { width } : undefined}
      >
        <CardHeader className='flex items-start gap-2.5'>
          {icon && (
            <IconTile size='sm' variant='soft' className={toneText[tone]}>
              {typeof icon === 'string' ? <Icon name={icon} decorative /> : icon}
            </IconTile>
          )}
          <div className='grid min-w-0 flex-1 gap-0.5'>
            <CardTitle className='truncate text-sm' title={typeof title === 'string' ? title : undefined}>{title}</CardTitle>
            {description && <CardDescription className='text-xs'>{description}</CardDescription>}
          </div>
          {actions.length > 0 && (
            <CardAction className='nodrag nopan -me-1 -mt-0.5 shrink-0'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon-xs' variant='ghost' tone='neutral' aria-label={actionsLabel || `Actions for ${title}`}>
                    <Icon name='MoreHorizontal' decorative />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {actions.map((action, index) => action === 'separator' ? (
                    <DropdownMenuSeparator key={`separator-${index}`} />
                  ) : (
                    <DropdownMenuItem
                      key={action.label}
                      disabled={action.disabled}
                      variant={action.destructive ? 'destructive' : undefined}
                      onSelect={() => action.onSelect?.(id)}
                    >
                      {action.icon && <Icon name={action.icon} decorative />}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          )}
        </CardHeader>
        {(status || badge || facts.length > 0 || owner || percent != null || content) && (
          <CardContent className='grid gap-2'>
            {content}
            {(status || badge || owner) && (
              <div className='flex min-w-0 flex-wrap items-center gap-1.5'>
                {status && <FlowStatus status={status} label={statusLabel} />}
                {badge && <Badge variant='outline' size='sm'>{badge}</Badge>}
                {owner && <Avatar size='xs' name={owner.name} src={owner.src} className='ms-auto' />}
              </div>
            )}
            {percent != null && (
              <div className='grid gap-1'>
                <div className='text-text-muted flex justify-between text-xs'>
                  <span>{progressLabel || 'Progress'}</span>
                  <span className='tabular-nums'>{percent}%</span>
                </div>
                <div
                  role='progressbar'
                  aria-label={`${progressLabel || 'Progress'} for ${title}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  className='ds-flow-progress'
                >
                  <span style={{ transform: `scaleX(${percent / 100})` }} />
                </div>
              </div>
            )}
            {facts.length > 0 && (
              <ul className='text-text-muted flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs' aria-label={`Details for ${title}`}>
                {facts.map((fact, index) => (
                  <li key={index} className='ds-flow-fact tabular-nums'>{fact}</li>
                ))}
              </ul>
            )}
          </CardContent>
        )}
        {footer && <CardFooter className='text-xs'>{footer}</CardFooter>}
      </Card>
      {target && <Handle type='target' position={targetPosition} isConnectable={isConnectable} className='ds-flow-handle' />}
      {outputs?.length
        ? <Outputs outputs={outputs} position={sourcePosition} connectable={isConnectable} />
        : source && <Handle type='source' position={sourcePosition} isConnectable={isConnectable} className='ds-flow-handle' />}
      {ports.length > 0 && <Ports ports={ports} connectable={isConnectable} />}
    </>
  );
}

/**
 * A compact pill node for triggers, ends, junctions and attachments: an icon (registry
 * name or element) and a label, with the same handles and tones as the step card.
 */
export function FlowPillNode({ data = {}, targetPosition = Position.Top, sourcePosition = Position.Bottom, isConnectable = true, selected }) {
  const { title, icon, tone = 'neutral', target = true, source = true } = data;
  return (
    <>
      <div data-slot='flow-pill' data-selected={selected || undefined} className='ds-flow-pill'>
        {icon && (typeof icon === 'string'
          ? <Icon name={icon} decorative size='sm' className={toneText[tone]} />
          : <span aria-hidden='true' className='inline-flex shrink-0 [&>svg]:size-4'>{icon}</span>)}
        <span className='truncate'>{title}</span>
      </div>
      {target && <Handle type='target' position={targetPosition} isConnectable={isConnectable} className='ds-flow-handle' />}
      {source && <Handle type='source' position={sourcePosition} isConnectable={isConnectable} className='ds-flow-handle' />}
    </>
  );
}

/** Glyphs for the small run badge under a tile; colour comes from the status token. */
const tileBadges = {
  success: 'Check',
  failed: 'X',
  running: 'RefreshCw',
  waiting: 'Pause',
  blocked: 'Lock',
  queued: 'Clock',
  skipped: 'Minus'
};

const renderIcon = (icon, tone, size = 'md') => (typeof icon === 'string'
  ? <Icon name={icon} decorative size={size} className={toneText[tone]} />
  : icon ? <span aria-hidden='true' className={cn('ds-flow-glyph inline-flex shrink-0', toneText[tone])}>{icon}</span> : null);

/**
 * A `tile` node for compact pipeline diagrams: a square (or, with `shape: 'circle'`, round)
 * tile holding a service or brand icon, a small run badge on its lower edge, and the title
 * with a meta line underneath. Round tiles suit satellites such as a connection, a test or
 * a model hanging off a step. `metaTone` colours the meta line, for an error message.
 */
export function FlowTileNode({ data = {}, selected, targetPosition = Position.Left, sourcePosition = Position.Right, isConnectable = true }) {
  const { title, meta, metaTone, icon, tone = 'neutral', status, shape = 'square', target = true, source = true, ports = [], emphasis } = data;
  const badge = tileBadges[status];
  return (
    <>
      <div
        data-slot='flow-tile'
        data-shape={shape}
        data-status={status}
        data-selected={selected || undefined}
        data-emphasis={emphasis || undefined}
        className='ds-flow-tile'
      >
        <span className='ds-flow-tile-face'>
          {renderIcon(icon, tone, 'lg')}
          {badge && (
            <span className='ds-flow-tile-badge' data-status={status} aria-hidden='true'>
              <Icon name={badge} decorative size='xs' className={status === 'running' ? 'motion-safe:animate-spin' : undefined} />
            </span>
          )}
        </span>
        <span className='ds-flow-tile-title' title={typeof title === 'string' ? title : undefined}>{title}</span>
        {meta && <span className='ds-flow-tile-meta' data-tone={metaTone}>{meta}</span>}
      </div>
      {target && <Handle type='target' position={targetPosition} isConnectable={isConnectable} className='ds-flow-handle' />}
      {source && <Handle type='source' position={sourcePosition} isConnectable={isConnectable} className='ds-flow-handle' />}
      {ports.length > 0 && <Ports ports={ports} connectable={isConnectable} />}
    </>
  );
}

/**
 * A compact `task` card on one line: an icon tile, the title over a short description, and
 * an optional inline `action` (such as Approve) that runs without selecting the node. A
 * `waiting` status rings it in the warning tone, so a step waiting on a person stands out.
 */
export function FlowTaskNode({ id, data = {}, selected, targetPosition = Position.Left, sourcePosition = Position.Right, isConnectable = true }) {
  const { title, description, icon, tone = 'neutral', status, action, target = true, source = true, ports = [], emphasis } = data;
  return (
    <>
      <div
        data-slot='flow-task'
        data-status={status}
        data-selected={selected || undefined}
        data-emphasis={emphasis || undefined}
        className='ds-flow-task'
      >
        {icon && <span className='ds-flow-task-icon'>{renderIcon(icon, tone)}</span>}
        <span className='grid min-w-0 flex-1'>
          <span className='truncate text-sm font-medium'>{title}</span>
          {description && <span className='text-text-muted truncate text-xs'>{description}</span>}
        </span>
        {action && (
          <Button
            size='xs'
            variant={action.variant || 'default'}
            tone={action.tone}
            className='nodrag nopan shrink-0'
            aria-label={action.ariaLabel || `${action.label} ${title}`}
            disabled={action.disabled}
            onClick={(event) => {
              event.stopPropagation();
              action.onClick?.(id);
            }}
          >
            {action.label}
          </Button>
        )}
      </div>
      {target && <Handle type='target' position={targetPosition} isConnectable={isConnectable} className='ds-flow-handle' />}
      {source && <Handle type='source' position={sourcePosition} isConnectable={isConnectable} className='ds-flow-handle' />}
      {ports.length > 0 && <Ports ports={ports} connectable={isConnectable} />}
    </>
  );
}
