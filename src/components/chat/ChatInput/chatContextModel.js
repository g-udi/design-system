const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

/** Compact presentation for a supplied token count. */
export const formatTokenCount = (count) => compact.format(Math.max(0, Number(count) || 0));
