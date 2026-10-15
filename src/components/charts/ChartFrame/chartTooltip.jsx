// Server-safe tooltip rows and the factory that builds a Recharts tooltip from them.

/**
 * Build a Recharts tooltip `content` from rows.
 *
 * @param {(context: { label: unknown, payload: object[] }) => Array<{ label: React.ReactNode, value: React.ReactNode, color?: string }>} getRows
 * @param {{ title?: (label: unknown, payload: object[]) => React.ReactNode }} [options]
 * @returns {React.ComponentType} Pass as `<Tooltip content={<Rows />} />` or `content={Rows}`.
 */
export function createRowsTooltip(getRows, { title } = {}) {
  function RowsTooltip({ active, label, payload }) {
    if (!active || !payload?.length) return null;
    const rows = getRows({ label, payload }).filter(Boolean);
    const heading = title ? title(label, payload) : label;

    return <ChartTooltipRows rows={ rows } title={ heading } />;
  }

  return RowsTooltip;
}

/** The tooltip panel: an optional title and label/value rows with colour swatches. */
export function ChartTooltipRows({ rows = [], title }) {
  return (
    <div className='min-w-36 max-w-xs wrap-anywhere whitespace-normal rounded-(--ds-radius-card) border border-border bg-surface px-3 py-2 text-xs shadow-lg' data-slot='chart-tooltip'>
      {title != null && title !== '' ? <div className='mb-1 font-semibold text-text'>{title}</div> : null}
      <div className='grid gap-1'>
        {rows.map((row, index) => (
          <div key={ `${row.label}-${index}` } className='flex items-center justify-between gap-5 text-text-muted'>
            <span className='flex min-w-0 items-center gap-1.5'>
              {row.color ? <span aria-hidden='true' className='size-2 shrink-0 rounded-sm' data-slot='chart-mark' style={{ 'background': row.color }} /> : null}
              {row.label}
            </span>
            <span className='font-mono font-semibold tabular-nums text-text'>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
