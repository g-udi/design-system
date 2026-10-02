import { ClaudeAiIcon } from '../../../../icons/brands/claudeAiIcon.jsx';
import { Gemini } from '../../../../icons/brands/gemini.jsx';
import { Openai } from '../../../../icons/brands/openai.jsx';

/*
 * A starting catalogue for ChatModelSelect and ChatContextMeter. It is plain data: apps replace it, filter
 * it to the models their plan allows, or spread an entry to change a label. `contextWindow` is in tokens;
 * `pricing` is US dollars per million tokens (`input`, `output`, `cachedInput`) and only feeds the cost
 * estimate in ChatContextMeter, so keep it in step with your provider's price list. `speed` is
 * `fast`, `balanced` or `slow`, and `cost` a relative 1 to 4 scale shown as dollar signs.
 */
const chatModelProviders = {
  anthropic: { value: 'anthropic', label: 'Anthropic', icon: ClaudeAiIcon },
  openai: { value: 'openai', label: 'OpenAI', icon: Openai },
  google: { value: 'google', label: 'Google', icon: Gemini }
};

const claude = (model) => ({ provider: 'anthropic', icon: ClaudeAiIcon, ...model });
const openai = (model) => ({ provider: 'openai', icon: Openai, ...model });
const google = (model) => ({ provider: 'google', icon: Gemini, ...model });

const chatModels = [
  claude({
    value: 'claude-opus-5',
    label: 'Claude Opus 5',
    description: 'Deep reasoning, long agentic work and hard code.',
    contextWindow: 1_000_000,
    capabilities: ['vision', 'reasoning', 'tools', 'web'],
    speed: 'slow',
    cost: 3,
    pricing: { input: 5, output: 25, cachedInput: 0.5 }
  }),
  claude({
    value: 'claude-opus-4-8',
    label: 'Claude Opus 4.8',
    description: 'The previous Opus, for teams pinned to it.',
    contextWindow: 1_000_000,
    capabilities: ['vision', 'reasoning', 'tools', 'web'],
    speed: 'slow',
    cost: 3,
    pricing: { input: 5, output: 25, cachedInput: 0.5 }
  }),
  claude({
    value: 'claude-sonnet-5',
    label: 'Claude Sonnet 5',
    description: 'Strong everyday model for writing, research and code.',
    badge: 'Recommended',
    badgeTone: 'accent',
    contextWindow: 1_000_000,
    capabilities: ['vision', 'reasoning', 'tools', 'web'],
    speed: 'balanced',
    cost: 2,
    pricing: { input: 2, output: 10, cachedInput: 0.2 }
  }),
  claude({
    value: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    description: 'Balanced quality and speed.',
    contextWindow: 1_000_000,
    capabilities: ['vision', 'reasoning', 'tools', 'web'],
    speed: 'balanced',
    cost: 2,
    pricing: { input: 3, output: 15, cachedInput: 0.3 }
  }),
  claude({
    value: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    description: 'Fast and light for quick edits and high volume.',
    contextWindow: 200_000,
    capabilities: ['vision', 'reasoning', 'tools'],
    speed: 'fast',
    cost: 1,
    pricing: { input: 1, output: 5, cachedInput: 0.1 }
  }),
  openai({
    value: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Fast multimodal chat with images and audio.',
    contextWindow: 128_000,
    capabilities: ['vision', 'tools', 'web'],
    speed: 'fast',
    cost: 2,
    pricing: { input: 2.5, output: 10, cachedInput: 1.25 }
  }),
  openai({
    value: 'gpt-4.1',
    label: 'GPT-4.1',
    description: 'Long-context instruction following and code.',
    contextWindow: 1_047_576,
    capabilities: ['vision', 'tools'],
    speed: 'balanced',
    cost: 2,
    pricing: { input: 2, output: 8, cachedInput: 0.5 }
  }),
  openai({
    value: 'gpt-4.1-mini',
    label: 'GPT-4.1 mini',
    description: 'Cheaper GPT-4.1 for simple tasks.',
    contextWindow: 1_047_576,
    capabilities: ['vision', 'tools'],
    speed: 'fast',
    cost: 1,
    pricing: { input: 0.4, output: 1.6, cachedInput: 0.1 }
  }),
  openai({
    value: 'o3',
    label: 'o3',
    description: 'Reasons step by step before it answers.',
    contextWindow: 200_000,
    capabilities: ['vision', 'reasoning', 'tools', 'web'],
    speed: 'slow',
    cost: 2,
    pricing: { input: 2, output: 8, cachedInput: 0.5 }
  }),
  openai({
    value: 'o4-mini',
    label: 'o4-mini',
    description: 'Small, quick reasoning model.',
    contextWindow: 200_000,
    capabilities: ['vision', 'reasoning', 'tools'],
    speed: 'fast',
    cost: 1,
    pricing: { input: 1.1, output: 4.4, cachedInput: 0.275 }
  }),
  google({
    value: 'gemini-2.5-pro',
    label: 'Gemini 2.5 Pro',
    description: 'Multimodal reasoning over very long inputs.',
    contextWindow: 1_048_576,
    capabilities: ['vision', 'reasoning', 'tools', 'web'],
    speed: 'balanced',
    cost: 2,
    pricing: { input: 1.25, output: 10, cachedInput: 0.31 }
  }),
  google({
    value: 'gemini-2.5-flash',
    label: 'Gemini 2.5 Flash',
    description: 'Fast, low-cost multimodal answers.',
    contextWindow: 1_048_576,
    capabilities: ['vision', 'reasoning', 'tools', 'web'],
    speed: 'fast',
    cost: 1,
    pricing: { input: 0.3, output: 2.5, cachedInput: 0.075 }
  })
];

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

/** Token counts as people read them: 950, 84.2K, 1M. */
const formatTokenCount = (count) => compact.format(Math.max(0, Number(count) || 0));

/**
 * The estimated cost of a usage record in dollars, from `pricing` per million tokens. Cached input is
 * the part of `inputTokens` read from the cache; reasoning bills at the output rate. Returns null when
 * there is no pricing to estimate from.
 */
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

export { chatModels, chatModelProviders, estimateChatCost, formatTokenCount };
