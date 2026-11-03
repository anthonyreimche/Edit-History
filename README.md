# Edit History for Safelight

The Develop **Edit** panel: Undo, Redo and Reset for the photo you are
editing.

- **Undo / Redo:** step back and forward through the photo's edit history.
  Each is greyed out when there is no step to move to.
- **Reset:** start the photo over at its defaults. The reset is a history
  step of its own, so Undo brings the edit back.

Right-clicking the panel's header offers the same reset.

Until Safelight 3.2.0 this panel was built in. It keeps the built-in panel's
id (`core.edit`), so layouts saved before then keep it where it was.

## Development

```bash
npm install
npm run typecheck
npm run build    # dist/index.js, the file Safelight loads
npm test         # vitest; the bundle checks read dist/, so build first
npm run check    # all three, in that order
```

Safelight hands the extension its own React through `api.react`, so the
bundle never includes React. `src/safelight.d.ts` mirrors the part of the
app's extension API the extension uses.

## Licence

GPL-3.0-only with an attribution term (GPL v3 §7b), the same licence as Safelight; see LICENSE. Copyright (C) 2026 Anthony Reimche.
