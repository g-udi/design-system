// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
export function isFilterRule(node) {
  return node.type === 'rule';
}
export function isFilterGroup(node) {
  return node.type === 'group';
}
export function createFilterRule(input) {
  const rule = {
    id: input.id,
    type: 'rule',
    path: input.path,
    operator: input.operator,
    value: input.value
  };
  if (input.negated) rule.negated = true;
  return rule;
}
export function createFilterGroup(input) {
  return {
    id: input.id,
    type: 'group',
    combinator: input.combinator ?? 'and',
    rules: input.rules ?? []
  };
}
export function createFilterQuery(rules = [], combinator = 'and', id = 'root') {
  return { id, type: 'group', combinator, rules };
}
export function flattenFilterRules(query) {
  const out = [];
  const walk = (node) => {
    if (isFilterRule(node)) {
      out.push(node);
      return;
    }
    for (const child of node.rules) walk(child);
  };
  walk(query);
  return out;
}
export function isFilterRuleComplete(rule) {
  return rule.operator !== '';
}
export function flattenFilterConditions(query) {
  return flattenFilterRules(query)
    .filter(isFilterRuleComplete)
    .map((rule) => ({
      path: rule.path,
      field: rule.path[0],
      operator: rule.operator,
      values:
        rule.value === void 0 || rule.value === null
          ? []
          : Array.isArray(rule.value)
            ? rule.value
            : [rule.value],
      negated: Boolean(rule.negated)
    }));
}
export function countFilterRules(query) {
  let count = 0;
  const walk = (node) => {
    if (isFilterRule(node)) {
      count += 1;
      return;
    }
    for (const child of node.rules) walk(child);
  };
  walk(query);
  return count;
}
export function isFilterQueryEmpty(query) {
  return countFilterRules(query) === 0;
}
function isBlankFilterValue(value) {
  return value === void 0 || value === null || value === '';
}
function compareFilterBounds(from, to) {
  if (typeof from === 'number' && typeof to === 'number') {
    return Number.isNaN(from) || Number.isNaN(to) ? null : from - to;
  }
  if (from instanceof Date && to instanceof Date) {
    const a = from.getTime();
    const b = to.getTime();
    return Number.isNaN(a) || Number.isNaN(b) ? null : a - b;
  }
  if (typeof from === 'string' && typeof to === 'string') {
    const a = Date.parse(from);
    const b = Date.parse(to);
    return Number.isNaN(a) || Number.isNaN(b) ? null : a - b;
  }
  return null;
}
export function collectFilterIssues(query, arityOf, validateOf) {
  const issues = [];
  const visit = (group, isRoot) => {
    if (!isRoot && group.rules.length === 0) {
      issues.push({
        nodeId: group.id,
        column: 'group',
        reason: 'empty-group'
      });
    }
    for (const child of group.rules) {
      if (isFilterGroup(child)) {
        visit(child, false);
        continue;
      }
      const arity = arityOf(child);
      if (arity === null) continue;
      if (!isFilterRuleComplete(child)) {
        issues.push({
          nodeId: child.id,
          column: 'operator',
          reason: 'missing-operator'
        });
        continue;
      }
      if (arity === 'none') continue;
      const values =
        child.value === void 0 || child.value === null
          ? []
          : Array.isArray(child.value)
            ? child.value
            : [child.value];
      if (arity === 'range') {
        if (
          values.length < 2 ||
          isBlankFilterValue(values[0]) ||
          isBlankFilterValue(values[1])
        ) {
          issues.push({
            nodeId: child.id,
            column: 'value',
            reason: 'incomplete-range'
          });
          continue;
        }
        const order = compareFilterBounds(values[0], values[1]);
        if (order !== null && order > 0) {
          issues.push({
            nodeId: child.id,
            column: 'value',
            reason: 'reversed-range'
          });
        }
        continue;
      }
      if (values.length === 0 || values.every(isBlankFilterValue)) {
        issues.push({
          nodeId: child.id,
          column: 'value',
          reason: 'missing-value'
        });
        continue;
      }
      const message = validateOf?.(child);
      if (message) {
        issues.push({
          nodeId: child.id,
          column: 'value',
          reason: 'custom',
          message
        });
      }
    }
  };
  visit(query, true);
  return issues;
}
export function findFilterNode(query, id) {
  if (query.id === id) return { node: query, parent: null, index: -1 };
  const walk = (group) => {
    for (let i = 0; i < group.rules.length; i++) {
      const child = group.rules[i];
      if (child.id === id) return { node: child, parent: group, index: i };
      if (isFilterGroup(child)) {
        const found = walk(child);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(query);
}
export function findFilterRule(query, id) {
  const found = findFilterNode(query, id);
  if (!found || !isFilterRule(found.node)) return null;
  return found.node;
}
function rewriteGroup(group, shouldRewrite, transform) {
  if (shouldRewrite(group)) return transform(group);
  let changed = false;
  const rules = group.rules.map((child) => {
    if (!isFilterGroup(child)) return child;
    const next = rewriteGroup(child, shouldRewrite, transform);
    if (next !== child) changed = true;
    return next;
  });
  return changed ? { ...group, rules } : group;
}
export function updateFilterRule(query, id, updates) {
  return rewriteGroup(
    query,
    (group) =>
      group.rules.some((child) => child.id === id && isFilterRule(child)),
    (group) => ({
      ...group,
      rules: group.rules.map((child) =>
        child.id === id && isFilterRule(child)
          ? { ...child, ...updates }
          : child
      )
    })
  );
}
export function removeFilterNode(query, id) {
  const prune = (group) => {
    let changed = false;
    const rules = [];
    for (const child of group.rules) {
      if (child.id === id) {
        changed = true;
        continue;
      }
      if (isFilterGroup(child)) {
        const next = prune(child);
        if (next !== child) changed = true;
        if (next.rules.length === 0) continue;
        rules.push(next);
        continue;
      }
      rules.push(child);
    }
    return changed ? { ...group, rules } : group;
  };
  return prune(query);
}
export function insertFilterNode(query, node, parentId, index) {
  const targetId = parentId ?? query.id;
  return rewriteGroup(
    query,
    (group) => group.id === targetId,
    (group) => {
      const rules = [...group.rules];
      const at =
        index === void 0
          ? rules.length
          : Math.max(0, Math.min(index, rules.length));
      rules.splice(at, 0, node);
      return { ...group, rules };
    }
  );
}
function cloneFilterNode(node, nextId) {
  return isFilterRule(node)
    ? { ...node, id: nextId() }
    : {
        ...node,
        id: nextId(),
        rules: node.rules.map((child) => cloneFilterNode(child, nextId))
      };
}
export function duplicateFilterNode(query, id, nextId) {
  const found = findFilterNode(query, id);
  if (!found || !found.parent) return query;
  return insertFilterNode(
    query,
    cloneFilterNode(found.node, nextId),
    found.parent.id,
    found.index + 1
  );
}
export function setFilterCombinator(query, groupId, combinator) {
  return rewriteGroup(
    query,
    (group) => group.id === groupId,
    (group) =>
      group.combinator === combinator ? group : { ...group, combinator }
  );
}
export function toggleFilterCombinator(query, groupId) {
  const found = findFilterNode(query, groupId);
  if (!found || !isFilterGroup(found.node)) return query;
  return setFilterCombinator(
    query,
    groupId,
    found.node.combinator === 'and' ? 'or' : 'and'
  );
}
export function moveFilterNode(query, id, delta) {
  const found = findFilterNode(query, id);
  if (!found || !found.parent) return query;
  const from = found.index;
  const to = from + delta;
  if (to < 0 || to >= found.parent.rules.length || delta === 0) return query;
  return rewriteGroup(
    query,
    (group) => group.id === found.parent.id,
    (group) => {
      const rules = [...group.rules];
      const [moved] = rules.splice(from, 1);
      rules.splice(to, 0, moved);
      return { ...group, rules };
    }
  );
}
function containsFilterNode(node, id) {
  if (node.id === id) return true;
  if (isFilterRule(node)) return false;
  return node.rules.some((child) => containsFilterNode(child, id));
}
function detachFilterNode(group, id) {
  let changed = false;
  const rules = [];
  for (const child of group.rules) {
    if (child.id === id) {
      changed = true;
      continue;
    }
    if (isFilterGroup(child)) {
      const next = detachFilterNode(child, id);
      if (next !== child) changed = true;
      rules.push(next);
      continue;
    }
    rules.push(child);
  }
  return changed ? { ...group, rules } : group;
}
export function moveFilterNodeTo(query, id, parentId, index) {
  const found = findFilterNode(query, id);
  if (!found || !found.parent) return query;
  if (containsFilterNode(found.node, parentId)) return query;
  const destination = findFilterNode(query, parentId);
  if (!destination || !isFilterGroup(destination.node)) return query;
  const sameParent = found.parent.id === parentId;
  const target = sameParent && found.index < index ? index - 1 : index;
  if (sameParent && target === found.index) return query;
  return insertFilterNode(
    detachFilterNode(query, id),
    found.node,
    parentId,
    target
  );
}
export function copyFilterNodeTo(query, id, parentId, index, nextId) {
  const found = findFilterNode(query, id);
  if (!found || !found.parent) return query;
  const destination = findFilterNode(query, parentId);
  if (!destination || !isFilterGroup(destination.node)) return query;
  return insertFilterNode(
    query,
    cloneFilterNode(found.node, nextId),
    parentId,
    index
  );
}
export function wrapFilterNodeInGroup(query, id, groupId, combinator = 'or') {
  const found = findFilterNode(query, id);
  if (!found || !found.parent) return query;
  return rewriteGroup(
    query,
    (group) => group.id === found.parent.id,
    (group) => ({
      ...group,
      rules: group.rules.map((child) =>
        child.id === id
          ? createFilterGroup({ id: groupId, combinator, rules: [child] })
          : child
      )
    })
  );
}
export function unwrapFilterGroup(query, groupId) {
  if (query.id === groupId) return query;
  const found = findFilterNode(query, groupId);
  if (!found || !found.parent || !isFilterGroup(found.node)) return query;
  const dissolved = found.node;
  return rewriteGroup(
    query,
    (group) => group.id === found.parent.id,
    (group) => {
      const rules = [...group.rules];
      rules.splice(found.index, 1, ...dissolved.rules);
      return { ...group, rules };
    }
  );
}
export function clearFilterQuery(query) {
  return query.rules.length === 0 ? query : { ...query, rules: [] };
}
export function pruneFilterQuery(query) {
  const prune = (node) => {
    if (isFilterRule(node)) return node;
    const rules2 = [];
    for (const child of node.rules) {
      const next = prune(child);
      if (next) rules2.push(next);
    }
    if (rules2.length === 0) return null;
    if (rules2.length === 1 && isFilterGroup(rules2[0])) return rules2[0];
    return { ...node, rules: rules2 };
  };
  const rules = [];
  for (const child of query.rules) {
    const next = prune(child);
    if (next) rules.push(next);
  }
  return { ...query, rules };
}
