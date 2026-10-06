import { formatTokenCount } from '@gaudi/design-system/chat/ChatInput';

// Demo billing assumptions live here. Real applications prepare totals and cost labels themselves.
function estimateChatCost(usage = {}, pricing) {
  if (!pricing) return null;
  const { inputTokens = 0, outputTokens = 0, reasoningTokens = 0, cachedInputTokens = 0 } = usage;
  const cached = Math.min(cachedInputTokens, inputTokens);
  const parts = {
    input: ((inputTokens - cached) * (pricing.input ?? 0)) / 1e6,
    cachedInput: (cached * (pricing.cachedInput ?? pricing.input ?? 0)) / 1e6,
    output: (outputTokens * (pricing.output ?? 0)) / 1e6,
    reasoning: (reasoningTokens * (pricing.reasoning ?? pricing.output ?? 0)) / 1e6
  };
  return { ...parts, total: parts.input + parts.cachedInput + parts.output + parts.reasoning };
}


const money = (amount) => amount > 0 && amount < 0.01 ? '<$0.01' : `$${amount.toFixed(2)}`;

export function demoContext(usage, model) {
  const { inputTokens = 0, cachedInputTokens = 0, outputTokens = 0, reasoningTokens = 0 } = usage;
  const usedTokens = inputTokens + outputTokens + reasoningTokens;
  const estimate = estimateChatCost(usage, model.pricing);
  const ratio = usedTokens / model.contextWindow;
  const tone = ratio >= 0.9 ? 'danger' : ratio >= 0.75 ? 'warning' : 'accent';
  const rows = [
    ['input', 'Input', inputTokens - Math.min(cachedInputTokens, inputTokens)],
    ['cachedInput', 'Cached input', cachedInputTokens],
    ['output', 'Output', outputTokens],
    ['reasoning', 'Reasoning', reasoningTokens]
  ];
  return {
    usedTokens,
    maxTokens: model.contextWindow,
    modelLabel: model.label,
    breakdown: rows.map(([id, label, tokens]) => ({ id, label, value: formatTokenCount(tokens), detail: money(estimate[id]) })),
    cost: money(estimate.total),
    costLabel: 'Estimated cost',
    tone,
    message: tone === 'danger' ? 'This example is near its configured limit.' : tone === 'warning' ? 'This example has used most of its configured limit.' : undefined
  };
}
