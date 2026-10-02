'use client';

/**
 * Embed
 *
 * @description The shared preview vocabulary for messages and content: one
 * switch that hands a piece of content to the owner that already renders it.
 * Code goes to CodeBlock, a live page to WebPreview, a link to LinkPreview.
 * Images and videos default to a LinkPreview card (image or thumbnail with
 * the destination); pass `components={{ image, video }}` to use a lightbox
 * image or a video player such as the MDX Image and Video. Embed adds no
 * behaviour of its own.
 */

import { cn } from '../../../utilities/cn';
import { CodeBlock } from '../CodeBlock/parts/code-block-extended.jsx';
import LinkPreview from '../LinkPreview/LinkPreview.jsx';
import WebPreview from '../WebPreview/WebPreview.jsx';
import { resolveEmbedType } from './parts/embed-model.js';

/**
 * @param {Object} props
 * @param {'auto'|'link'|'web'|'code'|'image'|'video'} [props.type='auto'] - What to render; auto decides from the other props
 * @param {string} [props.url] - Link, page or media address
 * @param {string} [props.src] - Image or video source (falls back to url)
 * @param {string} [props.code] - Source code for type code
 * @param {string} [props.language] - Code language
 * @param {string} [props.filename] - Code label
 * @param {string} [props.html] - Generated HTML for type web (srcDoc)
 * @param {string} [props.title] - Link text, page title or media title
 * @param {string} [props.alt] - Image alternative text
 * @param {Object} [props.previewData] - Static link metadata
 * @param {'card'|'compact'|'inline'} [props.variant='card'] - LinkPreview variant for links and media fallbacks
 * @param {Object} [props.components] - Renderer overrides keyed by type
 * @param {Object} [props.codeProps] / [props.webPreviewProps] / [props.linkPreviewProps] - Passed to the owner
 */
export default function Embed({
  type = 'auto',
  url,
  src,
  code,
  language,
  filename,
  html,
  title,
  alt,
  previewData,
  variant = 'card',
  components = {},
  codeProps,
  webPreviewProps,
  linkPreviewProps,
  className
}) {
  const resolved = resolveEmbedType({ code, html, src, type, url });
  const Override = components[resolved];
  const media = src || url;
  let content;

  if (Override) content = <Override url={ url } src={ media } code={ code } language={ language } filename={ filename } html={ html } title={ title } alt={ alt } previewData={ previewData } />;
  else if (resolved === 'code') content = <CodeBlock code={ code ?? '' } language={ language || 'text' } label={ filename } { ...codeProps } />;
  else if (resolved === 'web') content = <WebPreview defaultUrl={ url } srcDoc={ html } title={ title } previewData={ previewData } { ...webPreviewProps } />;
  else {
    // Links, and media without a dedicated renderer, show what the destination is.
    const mediaData = resolved === 'image' ? { 'image': media, 'imageAlt': alt, 'title': title || alt, 'type': 'image', ...previewData } : previewData;

    content = <LinkPreview url={ media } title={ title } variant={ variant } previewData={ mediaData } { ...linkPreviewProps } />;
  }

  // Inline links sit inside prose, so their wrapper must be phrasing content.
  const Element = variant === 'inline' && resolved === 'link' ? 'span' : 'div';

  return (
    <Element data-slot='embed' data-type={ resolved } className={ cn('min-w-0', className) }>
      {content}
    </Element>
  );
}
