// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The "Edit" panel: undo, redo and reset for the open photo's edit.

import { React, api } from "./rt";
import type { UiTokens } from "./safelight";

export const ROW_CLASS = "safelight-edit-actions";
export const BUTTON_CLASS = "safelight-edit-action";

/** The look core gave this panel with Tailwind utilities, as plain CSS (the
 *  app's Tailwind build never scans an extension). A stylesheet rather than
 *  inline styles keeps :hover and :disabled exact. `:where()` drops the rules
 *  to zero specificity, so any stylesheet that restyles `button` (Custom Input
 *  Styling, a user's own CSS) wins over them as it wins over core's layered
 *  utilities. The last rule repeats core's Accessibility ▸ Larger text rule
 *  for 11 px text. */
export function editActionsCss(t: UiTokens): string {
  return `
:where(.${ROW_CLASS}) { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem; }
:where(.${BUTTON_CLASS}) { flex: 1; border-radius: 0.25rem; background-color: ${t.surface2}; padding: 0.25rem 0.5rem; font-size: 11px; color: ${t.textSecondary}; }
@media (hover: hover) { :where(.${BUTTON_CLASS}:hover) { background-color: ${t.surface3}; color: ${t.textPrimary}; } }
:where(.${BUTTON_CLASS}:disabled) { cursor: default; opacity: 0.3; }
html.sl-larger-text .${BUTTON_CLASS} { font-size: 13px !important; line-height: 1.45 !important; }
`;
}

export function EditActionsPanel() {
  const useDevelopStore = api.stores.useDevelopStore;
  const reset = useDevelopStore((s) => s.reset);
  const undo = useDevelopStore((s) => s.undo);
  const redo = useDevelopStore((s) => s.redo);
  const historyIndex = useDevelopStore((s) => s.historyIndex);
  const historyLength = useDevelopStore((s) => s.history.length);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  return (
    <div className={ROW_CLASS}>
      <button onClick={undo} disabled={!canUndo} className={BUTTON_CLASS} title="Undo">
        {"↩"} Undo
      </button>
      <button onClick={redo} disabled={!canRedo} className={BUTTON_CLASS} title="Redo">
        {"↪"} Redo
      </button>
      <button onClick={reset} className={BUTTON_CLASS} title="Reset all edits">
        Reset
      </button>
    </div>
  );
}
