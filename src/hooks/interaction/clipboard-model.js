/** Clipboard writes behind useCopyToClipboard. Browser globals are read only when called, so this module is server-safe. */

/**
 * The `execCommand` fallback for local HTTP and embedded contexts without the Clipboard API. It
 * restores the reader's focus and text selection afterwards, unless a copy handler moved focus.
 */
function copyWithSelection(text) {
  const focused = document.activeElement;
  const field = focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement ? focused : null;
  const fieldSelection = field?.selectionStart != null && field.selectionEnd != null
    ? { start: field.selectionStart, end: field.selectionEnd, direction: field.selectionDirection }
    : null;
  const selection = document.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : [];
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('aria-hidden', 'true');
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.insetInlineStart = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    const restoreFocus = document.activeElement === textarea;
    textarea.remove();
    if (restoreFocus && focused instanceof HTMLElement && focused.isConnected) {
      focused.focus({ preventScroll: true });
      if (field && fieldSelection) field.setSelectionRange(fieldSelection.start, fieldSelection.end, fieldSelection.direction ?? undefined);
      else if (selection) {
        selection.removeAllRanges();
        ranges.forEach((range) => selection.addRange(range));
      }
    }
  }
}

/**
 * Write `text` to the clipboard. Resolves `true` on success. Uses the async Clipboard API and falls
 * back to a hidden textarea; resolves `false` during server rendering or when both are blocked.
 */
export async function writeToClipboard(text, { isCurrent = () => true } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or insecure context: try the selection fallback below.
  }
  if (!isCurrent()) return false;
  return copyWithSelection(text);
}
