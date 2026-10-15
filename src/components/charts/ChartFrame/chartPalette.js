// Chart colour tokens, kept free of Recharts so server-safe helpers can read them.

/** Categorical series colours, in order; the tokens follow light and dark themes. */
export const chartColors = [
  'var(--ds-color-chart-1)',
  'var(--ds-color-chart-2)',
  'var(--ds-color-chart-3)',
  'var(--ds-color-chart-4)',
  'var(--ds-color-chart-5)',
  'var(--ds-color-chart-6)',
  'var(--ds-color-chart-7)',
  'var(--ds-color-chart-8)'
];

/** The nth series colour: an explicit `colors` entry, else the categorical palette. */
export const getChartColor = (colors, index) => colors?.[index] || chartColors[index % chartColors.length];

/** Ordered ramps for magnitude: sequential (low → high), diverging (negative → positive), heatmap (empty → hot). */
export const chartScales = {
  'diverging': [ 'var(--ds-color-chart-div-neg-2)', 'var(--ds-color-chart-div-neg-1)', 'var(--ds-color-chart-div-mid)', 'var(--ds-color-chart-div-pos-1)', 'var(--ds-color-chart-div-pos-2)' ],
  'heatmap': [ 0, 1, 2, 3, 4, 5 ].map((step) => `var(--ds-color-chart-heat-${step})`),
  'heatmapInk': [ 0, 1, 2, 3, 4, 5 ].map((step) => `var(--ds-color-chart-heat-ink-${step})`),
  'sequential': [ 1, 2, 3, 4, 5 ].map((step) => `var(--ds-color-chart-seq-${step})`)
};
