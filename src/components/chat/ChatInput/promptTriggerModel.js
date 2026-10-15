/*
 * The trigger is the token right before the caret: `@` anywhere after a space starts a mention, and `/`
 * at the very start of the message starts a command. Choosing an item replaces the token with its
 * insertion text, so the message stays plain text the host can parse or send as is.
 */
const TRIGGER = /(^|\s)(@)([\w.-]*)$|^(\/)([\w-]*)$/;

export function findPromptTrigger(text, caret) {
  const before = text.slice(0, caret);
  const match = before.match(TRIGGER);
  if (!match) return null;
  const symbol = match[2] || match[4];
  const query = match[3] ?? match[5] ?? '';
  return { symbol, query, start: caret - query.length - 1, end: caret };
}
