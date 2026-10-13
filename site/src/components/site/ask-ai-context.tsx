'use client';

import { createContext, useContext, type ReactNode } from 'react';

/** Whether this deployment has the /api/ask server route (not in a static export or without a key). */
const AskAiContext = createContext(false);

/** Kept apart from the dialog so the root layout does not pull the chat components into its chunk. */
export function AskAiProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return <AskAiContext.Provider value={enabled}>{children}</AskAiContext.Provider>;
}

export const useAskAiEnabled = () => useContext(AskAiContext);
