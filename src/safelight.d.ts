// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The slice of Safelight's extension API this extension touches, mirrored from
// the app's src/extensions/types.ts, src/extensions/ui-kit.tsx and
// src/state/develop-store.ts. Extensions are standalone bundles, so the host's
// source is not on the type path; React types come from @types/react (dev only).

import type { ButtonHTMLAttributes, ComponentType, JSX } from "react";

export interface StoreApi<T> {
  (): T;
  <U>(selector: (state: T) => U): U;
  getState(): T;
  setState(partial: Partial<T> | ((s: T) => Partial<T>)): void;
  subscribe(listener: (state: T, prev: T) => void): () => void;
}

/** One step of the open photo's edit history. Core's snapshot also carries the
 *  params it restores, which this extension never reads. */
export interface EditSnapshot {
  timestamp: number;
  label: string;
}

export interface DevelopStoreState {
  /** The open photo's edit history, oldest first. */
  history: readonly EditSnapshot[];
  /** The step the photo shows now; -1 with no photo open. */
  historyIndex: number;
  undo(): void;
  redo(): void;
  /** Start the photo over at its defaults, as one undoable step. */
  reset(): Promise<void>;
  /** Take back or bring forward one of `source`'s own steps, as a step that
   *  keeps every other tool's edits (Safelight 3.2.8). */
  localUndo(source: string): Promise<void>;
  localRedo(source: string): Promise<void>;
}

/** One step an extension made. */
export interface LocalStep {
  index: number;
  label: string;
  timestamp: number;
}

/** An extension's local history on the open photo (Safelight 3.2.8). */
export interface LocalHistoryView {
  source: string;
  name: string;
  /** Its steps, oldest first; those past `cursor` are its redo. */
  steps: LocalStep[];
  /** The step its settings show now, -1 before its first. */
  cursor: number;
}

export interface PanelDockDefault {
  module: "library" | "develop";
  direction: "left" | "right" | "bottom";
  order?: number;
  width?: number;
  height?: number;
}

export interface PanelContribution {
  /** Globally unique, e.g. "core.histogram" or "my-ext.fancy-curves". */
  id: string;
  title: string;
  component: ComponentType;
  defaultDock?: PanelDockDefault;
  /** Right-clicking the panel's dock header offers "Reset to defaults". */
  onReset?: () => void;
}

/** A stylesheet applied to every app window after the core styles. Extension
 *  rules are unlayered, so they win over Tailwind utility classes at equal or
 *  lower specificity; disabling the extension removes the sheet. */
export interface StylesheetContribution {
  id: string;
  css: string;
}

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  /** Render as the selected/active state (accent fill), overriding the variant. */
  active?: boolean;
  /** Stretch to the container width. */
  full?: boolean;
}

export interface SafelightAPI {
  version: 1;
  extensionId: string;
  react: typeof import("react");
  registerPanel(c: PanelContribution): void;
  registerStylesheet(c: StylesheetContribution): void;
  ui: { Button: (props: ButtonProps) => JSX.Element };
  stores: {
    useDevelopStore: StoreApi<DevelopStoreState>;
  };
  /** Local history (Safelight 3.2.8). */
  develop: {
    useLocalHistory(source: string | null): LocalHistoryView | null;
    /** The latest edited extension, or the one picked in the History panel. */
    useChosenHistorySource(): string | null;
  };
}

export interface ExtensionModule {
  activate(api: SafelightAPI): void;
  deactivate?(): void;
}
