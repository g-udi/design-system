// Private helpers shared by the EventCalendar and Gantt roots.

const warned = new Set();

/** Logs a development warning once per `scope` and `key`. */
export function warnOnce(scope, key, message) {
  const id = `${scope}:${key}`;
  if (process.env.NODE_ENV !== 'production' && !warned.has(id)) {
    warned.add(id);
    console.warn(`[${scope}] ${message}`);
  }
}

/**
 * Splits root props into store options, view configuration (over its
 * defaults, ignoring undefined values) and the remaining DOM props.
 */
export function splitOptions(props, optionKeys, viewConfigKeys, defaultViewConfig) {
  const options = {};
  const viewConfig = { ...defaultViewConfig };
  const rest = {};
  for (const [key, value] of Object.entries(props)) {
    if (optionKeys.includes(key)) options[key] = value;
    else if (viewConfigKeys.includes(key)) {
      if (value !== void 0) viewConfig[key] = value;
    } else rest[key] = value;
  }
  return { options, viewConfig, rest };
}
