import { ogContentType, ogImage, ogSize } from '@/lib/og';
import { siteConfig } from '../../site.config';

export const dynamic = 'force-static';
export const alt = siteConfig.product;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: 'Documentation', title: siteConfig.product, description: siteConfig.description });
}
