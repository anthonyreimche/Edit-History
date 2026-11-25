// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The "Edit" panel: undo, redo and reset for the open photo's edit, and below
// them local undo and redo, which move only the chosen extension's own steps
// (the one edited last, or the one picked in the History panel).

import { React, api } from "./rt";
import type { LocalHistoryView } from "./safelight";

export const ROW_CLASS = "safelight-edit-actions";
export const LOCAL_ROW_CLASS = "safelight-edit-local-actions";
export const BUTTON_CLASS = "safelight-edit-action";

/** Only the row's layout: the buttons are the kit's. `:where()` keeps it at
 *  zero specificity so a user's own CSS wins. */
export function editActionsCss(): string {
  return `
:where(.${ROW_CLASS}) { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem; }
:where(.${LOCAL_ROW_CLASS}) { display: flex; align-items: center; gap: 0.375rem; padding: 0 0.5rem 0.5rem; }
:where(.${BUTTON_CLASS}) { flex: 1; }
`;
}

export function EditActionsPanel() {
  const { Button } = api.ui;
  const useDevelopStore = api.stores.useDevelopStore;
  const reset = useDevelopStore((s) => s.reset);
  const undo = useDevelopStore((s) => s.undo);
  const redo = useDevelopStore((s) => s.redo);
  const historyIndex = useDevelopStore((s) => s.historyIndex);
  const historyLength = useDevelopStore((s) => s.history.length);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  return (
    <div>
      <div className={ROW_CLASS}>
        <Button size="sm" className={BUTTON_CLASS} onClick={undo} disabled={!canUndo} title="Undo">
          {"↩"} Undo
        </Button>
        <Button size="sm" className={BUTTON_CLASS} onClick={redo} disabled={!canRedo} title="Redo">
          {"↪"} Redo
        </Button>
        <Button size="sm" className={BUTTON_CLASS} onClick={reset} title="Reset all edits">
          Reset
        </Button>
      </div>
      <LocalActions />
    </div>
  );
}

const NO_LOCAL = "Undo the last change of the extension edited last, keeping every other tool's edits";

/** Local undo and redo for the chosen extension. */
function LocalActions() {
  const { Button } = api.ui;
  const localUndo = api.stores.useDevelopStore((s) => s.localUndo);
  const localRedo = api.stores.useDevelopStore((s) => s.localRedo);
  const local = api.develop.useLocalHistory(api.develop.useChosenHistorySource());
  const undone = local?.steps[local.cursor];
  const redone = local?.steps[local.cursor + 1];
  return (
    <div className={LOCAL_ROW_CLASS}>
      <Button
        size="sm"
        className={BUTTON_CLASS}
        onClick={() => local && void localUndo(local.source)}
        disabled={!undone}
        title={tip(local, undone && `Undo ${undone.label}`, "undo")}
      >
        {"↩"} Local undo
      </Button>
      <Button
        size="sm"
        className={BUTTON_CLASS}
        onClick={() => local && void localRedo(local.source)}
        disabled={!redone}
        title={tip(local, redone && `Redo ${redone.label}`, "redo")}
      >
        {"↪"} Local redo
      </Button>
    </div>
  );
}

function tip(local: LocalHistoryView | null, action: string | undefined, verb: "undo" | "redo"): string {
  if (!local) return NO_LOCAL;
  return action ? `${action} in ${local.name} only` : `Nothing of ${local.name}'s to ${verb}`;
}
