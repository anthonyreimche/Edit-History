// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Registers the Develop "Edit" panel (undo, redo, reset). It was core's
// built-in `core.edit` until Safelight 3.2.0 and keeps that panel id, so saved
// layouts keep it where it was.

import { EditActionsPanel, editActionsCss } from "./EditActionsPanel";
import { initRuntime } from "./rt";
import type { SafelightAPI } from "./safelight";

export const PANEL_ID = "core.edit";
export const STYLESHEET_ID = "safelight.edit.styles";

export function activate(host: SafelightAPI): void {
  initRuntime(host);
  host.registerStylesheet({ id: STYLESHEET_ID, css: editActionsCss(host.ui.tokens) });
  host.registerPanel({
    id: PANEL_ID,
    title: "Edit",
    component: EditActionsPanel,
    defaultDock: { module: "develop", direction: "right", order: 0, width: 280, height: 76 },
    onReset: () => void host.stores.useDevelopStore.getState().reset(),
  });
}
