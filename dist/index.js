//#region src/rt.ts
var e, t;
function n(n) {
	t = n, e = n.react;
}
//#endregion
//#region src/EditActionsPanel.tsx
var r = "safelight-edit-actions", i = "safelight-edit-action";
function a(e) {
	return `
:where(.${r}) { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem; }
:where(.${i}) { flex: 1; border-radius: 0.25rem; background-color: ${e.surface2}; padding: 0.25rem 0.5rem; font-size: 11px; color: ${e.textSecondary}; }
@media (hover: hover) { :where(.${i}:hover) { background-color: ${e.surface3}; color: ${e.textPrimary}; } }
:where(.${i}:disabled) { cursor: default; opacity: 0.3; }
html.sl-larger-text .${i} { font-size: 13px !important; line-height: 1.45 !important; }
`;
}
function o() {
	let n = t.stores.useDevelopStore, a = n((e) => e.reset), o = n((e) => e.undo), s = n((e) => e.redo), c = n((e) => e.historyIndex), l = n((e) => e.history.length), u = c > 0, d = c < l - 1;
	return /* @__PURE__ */ e.createElement("div", { className: r }, /* @__PURE__ */ e.createElement("button", {
		onClick: o,
		disabled: !u,
		className: i,
		title: "Undo"
	}, "↩", " Undo"), /* @__PURE__ */ e.createElement("button", {
		onClick: s,
		disabled: !d,
		className: i,
		title: "Redo"
	}, "↪", " Redo"), /* @__PURE__ */ e.createElement("button", {
		onClick: a,
		className: i,
		title: "Reset all edits"
	}, "Reset"));
}
//#endregion
//#region src/index.tsx
var s = "core.edit", c = "safelight.edit.styles";
function l(e) {
	n(e), e.registerStylesheet({
		id: c,
		css: a(e.ui.tokens)
	}), e.registerPanel({
		id: s,
		title: "Edit",
		component: o,
		defaultDock: {
			module: "develop",
			direction: "right",
			order: 0,
			width: 280,
			height: 76
		},
		onReset: () => void e.stores.useDevelopStore.getState().reset()
	});
}
//#endregion
export { s as PANEL_ID, c as STYLESHEET_ID, l as activate };

//# sourceMappingURL=index.js.map