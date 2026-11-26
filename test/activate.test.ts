// What activate() registers: the Edit panel under core's old panel id, title
// and dock spot (so saved layouts keep it), its dock-header reset, and the
// stylesheet that gives it core's look.

import { describe, expect, it } from "vitest";
import { BUTTON_CLASS, EditActionsPanel, ROW_CLASS } from "../src/EditActionsPanel";
import { PANEL_ID, STYLESHEET_ID, activate } from "../src/index";
import { fakeApi } from "./support/fake-api";

describe("activate", () => {
  it("registers exactly the Edit panel, as core's core.edit did", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.panels).toHaveLength(1);
    expect(rig.panels[0]).toEqual({
      id: "core.edit",
      title: "Edit",
      component: EditActionsPanel,
      defaultDock: { module: "develop", direction: "right", order: 0, width: 280, height: 108 },
      modules: ["develop"],
      onReset: expect.any(Function),
    });
    expect(PANEL_ID).toBe("core.edit");
  });

  it("resets the whole edit from the dock header", () => {
    const rig = fakeApi({ steps: 3, at: 1 });
    activate(rig.api);
    rig.panels[0].onReset?.();
    expect(rig.calls).toEqual(["reset"]);
    expect(rig.develop.getState().history.map((s) => s.label)).toEqual(["Step 0", "Step 1", "Reset"]);
  });

  it("registers one stylesheet for the panel's layout and leaves colour to the kit buttons", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.stylesheets.map((s) => s.id)).toEqual([STYLESHEET_ID]);
    const css = rig.stylesheets[0].css;
    expect(css).toContain(`:where(.${ROW_CLASS}) {`);
    expect(css).toContain(`:where(.${BUTTON_CLASS}) {`);
    expect(css).not.toContain("color");
  });

  it("keeps the button rules at zero specificity, below any stylesheet that restyles buttons", () => {
    const rig = fakeApi();
    activate(rig.api);
    const rules = rig.stylesheets[0].css.split("\n").filter((line) => line.includes(BUTTON_CLASS));
    const plain = rules.filter((line) => !line.includes(":where("));
    expect(plain).toEqual([]);
  });
});
