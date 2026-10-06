'use client';
import * as React from 'react';
import { applyCascadeSelection, getCascaderPath, isCascaderMoreNode } from '../cascaderModel.jsx';
import { toArray } from '../cascaderSelectionModel.js';
function useCascaderCombobox({
  latest,
  setValue,
  openReasonRef,
  setOpen,
  setQuery,
  announceNotice,
  multiple,
  isSelectable,
  isBranch,
  navigate,
  closeOnSelect,
  selectedValues,
  cascade,
  resolveNode,
  max,
  labels,
  hasOpenFlyout,
  revealSelected,
  value,
  setPathWithReason,
  index
}) {
  const emitSelection = React.useCallback(
    (nextValues, node, reason) => {
      if (latest.current.disabled || latest.current.readOnly) return;
      const {
        selectedValues: current,
        multiple: currentMultiple,
        onValueChange: emit,
        index: currentIndex,
        resolveNode: resolve
      } = latest.current;
      const unchanged =
        nextValues.length === current.length &&
        nextValues.every((entry, i) => entry === current[i]);
      if (unchanged) return;
      const next = currentMultiple ? nextValues : (nextValues[0] ?? '');
      setValue(next);
      if (!emit) return;
      const chain = node ? getCascaderPath(currentIndex, node.value) : [];
      emit(next, {
        node,
        // A node absent from `items` has no chain, so fall back to the node
        // rather than report an empty path for a change that had one.
        path: node ? (chain.length ? chain : [node]) : [],
        // `resolveNode`, not `index.byValue`: a selected value missing from
        // `items` must still come back rather than be dropped.
        nodes: nextValues.map(resolve),
        reason
      });
    },
    [latest, setValue]
  );
  const setSelection = React.useCallback(
    (values, reason) => {
      const { selectedValues: current, resolveNode: resolve } = latest.current;
      const before = new Set(current);
      const after = new Set(values);
      const added = values.find((entry) => !before.has(entry));
      const removed = current.find((entry) => !after.has(entry));
      if (reason === 'clear') {
        emitSelection(values, null, 'clear');
        return;
      }
      if (added) {
        emitSelection(values, resolve(added), reason ?? 'select');
        return;
      }
      if (removed) {
        emitSelection(values, resolve(removed), reason ?? 'deselect');
        return;
      }
      emitSelection(values, null, reason ?? 'select');
    },
    [latest, emitSelection]
  );
  const commit = React.useCallback(
    (node) => {
      // Trail-column buttons and selection helpers share the root constraints.
      if (latest.current.disabled || latest.current.readOnly) return;
      const {
        multiple: currentMultiple,
        cascade: currentCascade,
        selectedValues: current,
        max: currentMax,
        index: currentIndex,
        isSelectable: currentIsSelectable,
        labels: currentLabels,
        closeOnSelect: currentCloseOnSelect
      } = latest.current;
      if (!currentMultiple) {
        emitSelection([node.value], node, 'select');
        if (currentCloseOnSelect) {
          openReasonRef.current = 'item-press';
          setOpen(false);
        } else {
          setQuery('');
        }
        return;
      }
      if (currentCascade) {
        const selecting = !current.includes(node.value);
        const next = applyCascadeSelection(
          currentIndex,
          current,
          node.value,
          selecting,
          currentIsSelectable
        );
        if (
          selecting &&
          currentMax != null &&
          next.length > currentMax &&
          next.length > current.length
        ) {
          announceNotice(currentLabels.maxReachedAnnouncement(currentMax));
          return;
        }
        emitSelection(next, node, selecting ? 'select' : 'deselect');
        const before = new Set(current);
        const after = new Set(next);
        let swept = 0;
        for (const entry of selecting ? next : current) {
          if (entry === node.value) continue;
          if (selecting ? !before.has(entry) : !after.has(entry)) swept += 1;
        }
        if (swept > 0) {
          announceNotice(
            currentLabels.cascadeAnnouncement(
              node.label ?? node.value,
              swept,
              selecting
            )
          );
        }
        setQuery('');
        return;
      }
      if (current.includes(node.value)) {
        emitSelection(
          current.filter((v) => v !== node.value),
          node,
          'deselect'
        );
      } else if (currentMax == null || current.length < currentMax) {
        emitSelection([...current, node.value], node, 'select');
      } else {
        announceNotice(currentLabels.maxReachedAnnouncement(currentMax));
      }
      setQuery('');
    },
    [latest, openReasonRef, emitSelection, setOpen, setQuery, announceNotice]
  );
  const handleComboboxValueChange = React.useCallback(
    (next, details) => {
      if (!multiple) {
        const node = Array.isArray(next) ? (next[0] ?? null) : next;
        if (node && isCascaderMoreNode(node)) {
          details.cancel();
          return;
        }
        if (node && !isSelectable(node) && isBranch(node)) {
          details.cancel();
          navigate(node);
          return;
        }
        if (node) {
          if (!closeOnSelect) details.cancel();
          commit(node);
        }
        return;
      }
      const nextNodes = Array.isArray(next) ? next : [];
      const before = new Set(selectedValues);
      const added = nextNodes.find((node) => !before.has(node.value));
      if (added && isCascaderMoreNode(added)) {
        details.cancel();
        return;
      }
      if (added && !isSelectable(added) && isBranch(added)) {
        details.cancel();
        navigate(added);
        return;
      }
      if (cascade) {
        const nextValues = new Set(nextNodes.map((node) => node.value));
        const removed = selectedValues.find((entry) => !nextValues.has(entry));
        const toggled =
          added ?? (removed != null ? resolveNode(removed) : null);
        if (toggled) commit(toggled);
        return;
      }
      if (
        max != null &&
        nextNodes.length > selectedValues.length &&
        nextNodes.length > max
      ) {
        details.cancel();
        announceNotice(labels.maxReachedAnnouncement(max));
        return;
      }
      setSelection(nextNodes.map((node) => node.value));
      setQuery('');
    },
    [
      multiple,
      selectedValues,
      max,
      cascade,
      closeOnSelect,
      labels,
      announceNotice,
      isSelectable,
      isBranch,
      navigate,
      commit,
      resolveNode,
      setSelection,
      setQuery
    ]
  );
  const handleOpenChange = React.useCallback(
    (nextOpen, details) => {
      if (details.isCanceled) return;
      if (!nextOpen && details.reason === 'escape-key' && hasOpenFlyout()) {
        details.cancel();
        return;
      }
      openReasonRef.current = details.reason ?? 'none';
      setOpen(nextOpen);
      if (!nextOpen) {
        setQuery('');
        return;
      }
      if (revealSelected) {
        setQuery('');
        const first = toArray(value)[0];
        setPathWithReason(
          first
            ? getCascaderPath(index, first)
                .slice(0, -1)
                .map((node) => node.value)
            : [],
          'reveal'
        );
      }
    },
    [
      setOpen,
      setQuery,
      revealSelected,
      value,
      index,
      setPathWithReason,
      hasOpenFlyout,
      openReasonRef
    ]
  );
  return { setSelection, commit, handleComboboxValueChange, handleOpenChange };
}
export { useCascaderCombobox };
