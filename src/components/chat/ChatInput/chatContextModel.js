import { formatLinkCount } from '../../core/LinkPreview/linkPreviewData.js';

/** Compact presentation for a supplied token count: 85700 -> 85.7K; missing or negative counts show 0. */
export const formatTokenCount = (count) => formatLinkCount(Math.max(0, Number(count) || 0));
