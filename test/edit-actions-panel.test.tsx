// The Edit panel in a DOM, over a real zustand develop store: Undo and Redo
// enabled only when there is a step to move to, Reset always, each button
// calling its store action, and the buttons following history changes made
// anywhere else (the keyboard shortcuts, the History list).

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BUTTON_CLASS, EditActionsPanel, ROW_CLASS } from "../src/EditActionsPanel";
import { React, initRuntime } from "../src/rt";
import { fakeApi, type Rig } from "./support/fake-api";

afterEach(cleanup);

function mount(history: { steps?: number; at?: number } = {}): Rig {
  const rig = fakeApi(history);
  initRuntime(rig.api);
  render(<EditActionsPanel />);
  return rig;
}

const undo = () => screen.getByTitle<HTMLButtonElement>("Undo");
const redo = () => screen.getByTitle<HTMLButtonElement>("Redo");
const reset = () => screen.getByTitle<HTMLButtonElement>("Reset all edits");

describe("EditActionsPanel", () => {
  it("shows Undo, Redo and Reset in one row with core's labels", () => {
    mount();
    const row = document.querySelector(`.${ROW_CLASS}`);
    expect(row).not.toBeNull();
    const buttons = [...(row?.querySelectorAll("button") ?? [])];
    expect(buttons.map((b) => b.textContent)).toEqual(["↩ Undo", "↪ Redo", "Reset"]);
    expect(buttons.every((b) => b.className === BUTTON_CLASS)).toBe(true);
  });

  it("disables Undo and Redo with no photo open, and leaves Reset enabled", () => {
    mount();
    expect(undo().disabled).toBe(true);
    expect(redo().disabled).toBe(true);
    expect(reset().disabled).toBe(false);
  });

  it("disables Undo at the first step and Redo at the last", () => {
    mount({ steps: 1, at: 0 });
    expect(undo().disabled).toBe(true);
    expect(redo().disabled).toBe(true);
    cleanup();
    mount({ steps: 3, at: 0 });
    expect(undo().disabled).toBe(true);
    expect(redo().disabled).toBe(false);
    cleanup();
    mount({ steps: 3, at: 2 });
    expect(undo().disabled).toBe(false);
    expect(redo().disabled).toBe(true);
  });

  it("enables both between the first and last step", () => {
    mount({ steps: 3, at: 1 });
    expect(undo().disabled).toBe(false);
    expect(redo().disabled).toBe(false);
  });

  it("undoes through the store until the first step", () => {
    const rig = mount({ steps: 3, at: 2 });
    fireEvent.click(undo());
    expect(rig.calls).toEqual(["undo"]);
    expect(rig.develop.getState().historyIndex).toBe(1);
    expect(redo().disabled).toBe(false);
    fireEvent.click(undo());
    expect(rig.develop.getState().historyIndex).toBe(0);
    expect(undo().disabled).toBe(true);
    fireEvent.click(undo());
    expect(rig.calls).toEqual(["undo", "undo"]);
  });

  it("redoes through the store until the last step", () => {
    const rig = mount({ steps: 3, at: 0 });
    fireEvent.click(redo());
    fireEvent.click(redo());
    expect(rig.calls).toEqual(["redo", "redo"]);
    expect(rig.develop.getState().historyIndex).toBe(2);
    expect(redo().disabled).toBe(true);
    expect(undo().disabled).toBe(false);
  });

  it("resets through the store as a new step, which drops the redo steps", async () => {
    const rig = mount({ steps: 3, at: 1 });
    await act(async () => {
      fireEvent.click(reset());
    });
    expect(rig.calls).toEqual(["reset"]);
    expect(rig.develop.getState().history.map((s) => s.label)).toEqual(["Step 0", "Step 1", "Reset"]);
    expect(undo().disabled).toBe(false);
    expect(redo().disabled).toBe(true);
  });

  it("follows history changes made outside the panel", () => {
    const rig = mount({ steps: 3, at: 2 });
    act(() => rig.develop.setState({ historyIndex: 0 }));
    expect(undo().disabled).toBe(true);
    expect(redo().disabled).toBe(false);
    act(() => rig.develop.setState({ history: [], historyIndex: -1 }));
    expect(redo().disabled).toBe(true);
  });
});
