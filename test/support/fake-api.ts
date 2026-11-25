// A stand-in Safelight API over real React and zustand. The develop store keeps
// an edit history the way core's does (undo and redo move through it, reset
// adds a step and drops any redo steps), every store action is recorded, and
// so is every registration. The chosen extension's local history is whatever
// the test sets in `local`; local undo and redo are recorded, not made.

import * as React from "react";
import { create } from "zustand";
import type {
  ButtonProps,
  DevelopStoreState,
  EditSnapshot,
  LocalHistoryView,
  PanelContribution,
  SafelightAPI,
  StoreApi,
  StylesheetContribution,
} from "../../src/safelight";

function Button({ variant = "secondary", size = "md", full: _full, active: _active, ...rest }: ButtonProps) {
  return React.createElement("button", { type: "button", "data-kit-variant": variant, "data-kit-size": size, ...rest });
}

export type DevelopAction = "undo" | "redo" | "reset" | `localUndo ${string}` | `localRedo ${string}`;

export interface Rig {
  api: SafelightAPI;
  develop: StoreApi<DevelopStoreState>;
  /** Every develop store action called, in order. */
  calls: DevelopAction[];
  /** The chosen extension's local history, null before any extension edits. */
  local: StoreApi<{ local: LocalHistoryView | null }>;
  panels: PanelContribution[];
  stylesheets: StylesheetContribution[];
}

const snapshot = (label: string): EditSnapshot => ({ timestamp: 0, label });

/** A history of `steps` edits showing step `at` (0-based). With no steps, no
 *  photo is open: an empty history at index -1, as core starts. */
export function fakeApi({
  steps = 0,
  at = steps - 1,
  local = null,
}: { steps?: number; at?: number; local?: LocalHistoryView | null } = {}): Rig {
  const calls: DevelopAction[] = [];
  const chosen = create<{ local: LocalHistoryView | null }>()(() => ({ local }));
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
    localUndo: async (source) => void calls.push(`localUndo ${source}`),
    localRedo: async (source) => void calls.push(`localRedo ${source}`),
  }));
  const api: SafelightAPI = {
    version: 1,
    extensionId: "safelight.edit",
    react: React,
    registerPanel: (c) => void panels.push(c),
    registerStylesheet: (c) => void stylesheets.push(c),
    ui: { Button },
    stores: { useDevelopStore: develop },
    develop: {
      useChosenHistorySource: () => chosen((s) => s.local?.source ?? null),
      useLocalHistory: (source) => {
        const view = chosen((s) => s.local);
        return source && view?.source === source ? view : null;
      },
    },
  };
  return { api, develop, calls, local: chosen, panels, stylesheets };
}
