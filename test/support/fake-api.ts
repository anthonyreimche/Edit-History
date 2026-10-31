// A stand-in Safelight API over real React and zustand. The develop store keeps
// an edit history the way core's does (undo and redo move through it, reset
// adds a step and drops any redo steps), every store action is recorded, and
// so is every registration.

import * as React from "react";
import { create } from "zustand";
import type {
  DevelopStoreState,
  EditSnapshot,
  PanelContribution,
  SafelightAPI,
  StoreApi,
  StylesheetContribution,
  UiTokens,
} from "../../src/safelight";

export const TOKENS: UiTokens = {
  surface2: "var(--color-surface-2)",
  surface3: "var(--color-surface-3)",
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
};

export type DevelopAction = "undo" | "redo" | "reset";

export interface Rig {
  api: SafelightAPI;
  develop: StoreApi<DevelopStoreState>;
  /** Every develop store action called, in order. */
  calls: DevelopAction[];
  panels: PanelContribution[];
  stylesheets: StylesheetContribution[];
}

const snapshot = (label: string): EditSnapshot => ({ timestamp: 0, label });

/** A history of `steps` edits showing step `at` (0-based). With no steps, no
 *  photo is open: an empty history at index -1, as core starts. */
export function fakeApi({ steps = 0, at = steps - 1 }: { steps?: number; at?: number } = {}): Rig {
  const calls: DevelopAction[] = [];
  const panels: PanelContribution[] = [];
  const stylesheets: StylesheetContribution[] = [];
  const develop: StoreApi<DevelopStoreState> = create<DevelopStoreState>()((set) => ({
    history: Array.from({ length: steps }, (_, i) => snapshot(`Step ${i}`)),
    historyIndex: at,
    undo: () => {
      calls.push("undo");
      set((s) => (s.historyIndex > 0 ? { historyIndex: s.historyIndex - 1 } : {}));
    },
    redo: () => {
      calls.push("redo");
      set((s) => (s.historyIndex < s.history.length - 1 ? { historyIndex: s.historyIndex + 1 } : {}));
    },
    reset: async () => {
      calls.push("reset");
      set((s) => {
        const history = [...s.history.slice(0, s.historyIndex + 1), snapshot("Reset")];
        return { history, historyIndex: history.length - 1 };
      });
    },
  }));
  const api: SafelightAPI = {
    version: 1,
    extensionId: "safelight.edit",
    react: React,
    registerPanel: (c) => void panels.push(c),
    registerStylesheet: (c) => void stylesheets.push(c),
    ui: { tokens: TOKENS },
    stores: { useDevelopStore: develop },
  };
  return { api, develop, calls, panels, stylesheets };
}
