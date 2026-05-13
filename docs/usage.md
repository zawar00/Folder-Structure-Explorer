# Folder Structure Explorer — Usage Guide

## Installation (Development)

1. Open the `folder-structure-vs-code` folder in VS Code.
2. Press **F5** — this launches a new VS Code window called the **Extension Development Host** with the extension already loaded.

---

## Where to Find It

Look for the **tree-list icon** in the **Activity Bar** (left sidebar).  
Click it to open the **Folder Structure Explorer** panel.

```
Activity Bar
│
├── Explorer         (default)
├── Search
├── Source Control
│
└── [ Tree icon ]   ← Folder Structure Explorer  (click here)
```

---

## The Toolbar Buttons

Inside the panel header you will see three icon buttons:

| Icon | Name | What it does |
|------|------|--------------|
| `📄` | Open in Editor | Opens a plain-text ASCII tree in a new editor tab |
| `📋` | Copy to Clipboard | Copies the same ASCII tree to your clipboard |
| `🔄` | Refresh | Re-reads the file system and redraws the tree |

---

## The Sidebar Tree

- **Folders** appear before files and can be **clicked to expand / collapse**.
- **Files** can be **clicked to open** them directly in the editor.
- The tree updates **automatically** when you add or delete files.

---

## Copying the Structure

Click the **Copy to Clipboard** button.  
Then paste anywhere — a README, a chat message, a design doc, etc.

Example output:

```
my-project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Header.tsx
│   ├── pages/
│   │   └── index.tsx
│   └── app.ts
├── public/
│   └── favicon.ico
├── package.json
└── tsconfig.json
```

---

## Opening in Editor

Click the **Open in Editor** button.  
A new tab opens with the full ASCII tree as plain text.  
You can then:
- **Save it** (`Ctrl+S`) as a `.txt` or `.md` file.
- **Select all and copy** (`Ctrl+A`, `Ctrl+C`).
- **Edit it** before sharing.

---

## Settings (Exclusions)

Go to **File → Preferences → Settings** and search for **"Folder Structure"**.

| Setting | Default | Description |
|---------|---------|-------------|
| `exclude.nodeModules` | `true` | Hide the `node_modules` folder |
| `exclude.gitFolder` | `true` | Hide the `.git` folder |
| `exclude.respectGitignore` | `true` | Respect rules in your `.gitignore` file |
| `exclude.hiddenFiles` | `false` | Hide files/folders starting with `.` (e.g. `.env`) |
| `exclude.customPatterns` | `[]` | Your own patterns to hide (see below) |

### Custom Patterns Example

In `settings.json`:

```json
"folderStructure.exclude.customPatterns": [
  "dist",
  "build",
  "*.log",
  "coverage"
]
```

Patterns support `*` as a wildcard. Adding a pattern here hides it from both the sidebar tree and the copied/exported output.

---

## Refreshing Manually

The tree auto-refreshes on file create/delete.  
If you change a setting or rename a folder and the tree looks stale, click the **Refresh** button.

---

## Packaging the Extension (Optional)

To install the extension permanently in your VS Code (not just dev mode):

```bash
npm install -g @vscode/vsce
vsce package
```

This creates a `.vsix` file. Install it via:

```
Extensions panel → "..." menu → Install from VSIX...
```
