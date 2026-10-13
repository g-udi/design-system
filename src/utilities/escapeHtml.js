const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text for an HTML or XML text node or quoted attribute value. */
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => entities[character]);
