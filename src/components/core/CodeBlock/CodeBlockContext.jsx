'use client';
import { createContext, useCallback, useContext, useMemo } from 'react';
const CodeBlockConfigContext = createContext(null);
const CodeBlockDocumentContext = createContext(null);
const CodeBlockHeaderContext = createContext(false);
const CodeBlockSurfacePropsContext = createContext(null);
const CodeBlockActionsContext = createContext(null);
function useInternalConfig(part) {
  const context = useContext(CodeBlockConfigContext);
  if (!context) {
    throw new Error(`${part} must be used within a CodeBlock`);
  }
  return context;
}
function useCodeBlockConfig(part) {
  const context = useContext(CodeBlockConfigContext);
  const document2 = useContext(CodeBlockDocumentContext);
  if (!context || !document2) {
    throw new Error(`${part} must be used within a CodeBlock`);
  }
  return useMemo(
    () => ({ ...context, code: document2.code }),
    [context, document2.code]
  );
}
function useCodeBlockFolding() {
  const document2 = useContext(CodeBlockDocumentContext);
  if (!document2) {
    throw new Error('useCodeBlockFolding must be used within a CodeBlock');
  }
  const { foldable, foldRegions, folded, toggleFold, setFolded } = document2;
  const foldedStarts = useMemo(
    () => [...folded].sort((a, b) => a - b),
    [folded]
  );
  const foldAll = useCallback(
    () => setFolded(foldRegions.map((region) => region.start)),
    [setFolded, foldRegions]
  );
  const unfoldAll = useCallback(() => setFolded([]), [setFolded]);
  return {
    foldable,
    regions: foldRegions,
    foldedStarts,
    toggleFold,
    foldAll,
    unfoldAll
  };
}
function useCodeBlockSelection() {
  const document2 = useContext(CodeBlockDocumentContext);
  if (!document2) {
    throw new Error('useCodeBlockSelection must be used within a CodeBlock');
  }
  const { selected, selectable, toggleLine, clearSelection } = document2;
  const selectedLines = useMemo(
    () => [...selected].sort((a, b) => a - b),
    [selected]
  );
  return { selectable, selectedLines, toggleLine, clearSelection };
}
export { CodeBlockConfigContext, CodeBlockDocumentContext, CodeBlockSurfacePropsContext, CodeBlockActionsContext, useCodeBlockConfig, useCodeBlockFolding, useCodeBlockSelection, CodeBlockHeaderContext, useInternalConfig };
