'use client';

/**
 * WebPreview
 *
 * @description A ready-made framed browser: history buttons, an editable
 * address bar, open in a new tab and device widths above a sandboxed page,
 * with an optional console underneath. Compose the parts from
 * `@gaudi/design-system/core/WebPreview` for a different toolbar.
 */

import { cn } from '../../../utilities/cn';
import {
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewDevices,
  WebPreviewHistoryButtons,
  WebPreviewNavigation,
  WebPreviewOpenButton,
  WebPreviewRoot,
  WebPreviewUrl
} from './parts/web-preview.jsx';

/**
 * @param {Object} props
 * @param {string} [props.url] / [props.defaultUrl] - Controlled or initial address
 * @param {Function} [props.onUrlChange] - Called with each visited address
 * @param {string|Function} [props.srcDoc] - Generated HTML, or (url) => HTML|null, instead of loading the address
 * @param {string} [props.title] - Accessible name of the framed page
 * @param {'desktop'|'tablet'|'phone'} [props.device] / [props.defaultDevice] - Controlled or initial width
 * @param {Function} [props.onDeviceChange]
 * @param {boolean|string[]} [props.devices=true] - Show the width toggle, or limit it to some devices
 * @param {Array} [props.logs] - Console entries; passing an array shows the console
 * @param {boolean} [props.defaultConsoleOpen=false]
 * @param {boolean} [props.embeddable=true] - false shows a LinkPreview card instead of the frame
 * @param {Object} [props.previewData] - Metadata for that fallback card
 * @param {string|Function|null} [props.endpoint] - Preview endpoint for that fallback card
 * @param {React.ReactNode} [props.fallback] - Custom blocked-embed content
 * @param {string} [props.sandbox] - iframe sandbox tokens
 * @param {string} [props.allow] - iframe permissions policy
 * @param {React.ReactNode} [props.actions] - Extra toolbar controls after the address bar
 * @param {Object} [props.labels] - Copy overrides
 * @param {Function} [props.onLoad] - Called with the url after each page load
 * @param {string} [props.className] - Root class; set a height such as h-[32rem]
 */
export default function WebPreview({
  url,
  defaultUrl,
  onUrlChange,
  srcDoc,
  title,
  device,
  defaultDevice,
  onDeviceChange,
  devices = true,
  logs,
  defaultConsoleOpen = false,
  embeddable = true,
  previewData,
  endpoint,
  fallback,
  sandbox,
  allow,
  actions,
  labels,
  onLoad,
  className,
  ...props
}) {
  return (
    <WebPreviewRoot
      url={ url }
      defaultUrl={ defaultUrl }
      onUrlChange={ onUrlChange }
      device={ device }
      defaultDevice={ defaultDevice }
      onDeviceChange={ onDeviceChange }
      labels={ labels }
      className={ cn('h-[32rem]', className) }
      { ...props }
    >
      <WebPreviewNavigation>
        <WebPreviewHistoryButtons />
        <WebPreviewUrl />
        {srcDoc ? null : <WebPreviewOpenButton />}
        {actions}
        {devices ? <WebPreviewDevices devices={ Array.isArray(devices) ? devices : undefined } className='max-sm:ml-auto' /> : null}
      </WebPreviewNavigation>
      <WebPreviewBody
        title={ title }
        srcDoc={ srcDoc }
        sandbox={ sandbox }
        allow={ allow }
        embeddable={ embeddable }
        previewData={ previewData }
        endpoint={ endpoint }
        fallback={ fallback }
        onLoad={ onLoad }
      />
      {Array.isArray(logs) ? <WebPreviewConsole logs={ logs } defaultOpen={ defaultConsoleOpen } /> : null}
    </WebPreviewRoot>
  );
}
