//#region src/rt.ts
var e, t;
function n(n) {
	t = n, e = n.react;
}
//#endregion
//#region src/EditActionsPanel.tsx
var r = "safelight-edit-actions", i = "safelight-edit-local-actions", a = "safelight-edit-action";
function o() {
	return `
:where(.${r}) { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem; }
:where(.${i}) { display: flex; align-items: center; gap: 0.375rem; padding: 0 0.5rem 0.5rem; }
:where(.${a}) { flex: 1; }
`;
}
function s() {
	let { Button: n } = t.ui, i = t.stores.useDevelopStore, o = i((e) => e.reset), s = i((e) => e.undo), l = i((e) => e.redo), u = i((e) => e.historyIndex), d = i((e) => e.history.length), f = u > 0, p = u < d - 1;
	return /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("div", { className: r }, /* @__PURE__ */ e.createElement(n, {
		size: "sm",
		className: a,
		onClick: s,
		disabled: !f,
		title: "Undo"
	}, "↩", " Undo"), /* @__PURE__ */ e.createElement(n, {
		size: "sm",
		className: a,
		onClick: l,
		disabled: !p,
		title: "Redo"
	}, "↪", " Redo"), /* @__PURE__ */ e.createElement(n, {
		size: "sm",
		className: a,
		onClick: o,
		title: "Reset all edits"
	}, "Reset")), /* @__PURE__ */ e.createElement(c, null));
}
function c() {
	let { Button: n } = t.ui, r = t.stores.useDevelopStore((e) => e.localUndo), o = t.stores.useDevelopStore((e) => e.localRedo), s = t.develop.useLocalHistory(t.develop.useChosenHistorySource()), c = s?.steps[s.cursor], u = s?.steps[s.cursor + 1];
	return /* @__PURE__ */ e.createElement("div", { className: i }, /* @__PURE__ */ e.createElement(n, {
		size: "sm",
		className: a,
		onClick: () => s && void r(s.source),
		disabled: !c,
		title: l(s, c && `Undo ${c.label}`, "undo")
	}, "↩", " Local undo"), /* @__PURE__ */ e.createElement(n, {
		size: "sm",
		className: a,
		onClick: () => s && void o(s.source),
		disabled: !u,
		title: l(s, u && `Redo ${u.label}`, "redo")
	}, "↪", " Local redo"));
}
function l(e, t, n) {
	return e ? t ? `${t} in ${e.name} only` : `Nothing of ${e.name}'s to ${n}` : "Undo the last change of the extension edited last, keeping every other tool's edits";
}
//#endregion
//#region src/index.tsx
var u = "core.edit", d = "safelight.edit.styles";
function f(e) {
	n(e), e.registerStylesheet({
		id: d,
		css: o()
	}), e.registerPanel({
		id: u,
		title: "Edit",
		component: s,
		defaultDock: {
			module: "develop",
			direction: "right",
			order: 0,
			width: 280,
			height: 108
		},
		modules: ["develop"],
		onReset: () => void e.stores.useDevelopStore.getState().reset()
	});
}
//#endregion
export { u as PANEL_ID, d as STYLESHEET_ID, f as activate };

//# sourceMappingURL=index.js.map