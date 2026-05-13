# Folder Structure Explorer

[![GitHub](https://img.shields.io/badge/GitHub-zawar00%2FFolder--Structure--Explorer-blue?logo=github)](https://github.com/zawar00/Folder-Structure-Explorer)

A VS Code extension that displays your project's folder structure as an interactive tree, with options to copy, export, or save it.

## Features

- **Interactive tree view** — browse your project structure in the activity bar sidebar
- **Copy to clipboard** — copy the ASCII tree to your clipboard in one click
- **Open in editor** — open the tree as a plain-text document in a new tab
- **Save as Markdown** — export the tree wrapped in a fenced code block to a `.md` file
- **Expand all** — expand every folder in the tree at once
- **Auto-refresh** — the tree updates automatically when files are created or deleted

## Usage

Click the Folder Structure icon in the activity bar. Use the toolbar buttons at the top of the panel:

| Button | Command | Description |
| ------ | ------- | ----------- |
| $(refresh) | Refresh | Manually refresh the tree |
| $(clippy) | Copy to Clipboard | Copy ASCII tree to clipboard |
| $(file-text) | Open in Editor | Open tree in a new editor tab |
| $(expand-all) | Expand All | Expand all folders |
| $(save) | Save as Markdown | Save tree to a `.md` file |

## Configuration

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `folderStructure.exclude.nodeModules` | `true` | Exclude `node_modules` folders |
| `folderStructure.exclude.gitFolder` | `true` | Exclude the `.git` folder |
| `folderStructure.exclude.respectGitignore` | `true` | Honor `.gitignore` rules |
| `folderStructure.exclude.hiddenFiles` | `false` | Exclude hidden files and folders (dot-prefixed) |
| `folderStructure.exclude.customPatterns` | `[]` | Additional glob patterns to exclude, e.g. `["dist", "*.log"]` |

## Requirements

VS Code 1.85.0 or later.

## License

MIT — see [LICENSE](LICENSE).
