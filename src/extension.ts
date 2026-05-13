import * as vscode from 'vscode';
import * as fs from 'fs';
import { FolderStructureProvider, FolderItem } from './treeProvider';
import { generateTree } from './structureGenerator';

export function activate(context: vscode.ExtensionContext): void {
    const provider = new FolderStructureProvider();

    const treeView = vscode.window.createTreeView('folderStructureExplorer', {
        treeDataProvider: provider,
        showCollapseAll: true,
    });
    context.subscriptions.push(treeView);

    // Refresh the tree
    context.subscriptions.push(
        vscode.commands.registerCommand('folderStructure.refresh', () => {
            provider.refresh();
        })
    );

    // Copy ASCII tree to clipboard
    context.subscriptions.push(
        vscode.commands.registerCommand('folderStructure.copyToClipboard', async () => {
            const root = getWorkspaceRoot();
            if (!root) { return; }
            const tree = generateTree(root);
            await vscode.env.clipboard.writeText(tree);
            vscode.window.showInformationMessage('Folder structure copied to clipboard!');
        })
    );

    // Open ASCII tree in a new editor tab
    context.subscriptions.push(
        vscode.commands.registerCommand('folderStructure.openInEditor', async () => {
            const root = getWorkspaceRoot();
            if (!root) { return; }
            const tree = generateTree(root);
            const doc = await vscode.workspace.openTextDocument({
                content: tree,
                language: 'plaintext',
            });
            await vscode.window.showTextDocument(doc, { preview: false });
        })
    );

    // Save folder structure as a .md file
    context.subscriptions.push(
        vscode.commands.registerCommand('folderStructure.saveAsMarkdown', async () => {
            const root = getWorkspaceRoot();
            if (!root) { return; }

            const defaultUri = vscode.Uri.file(`${root}/folder-structure.md`);
            const uri = await vscode.window.showSaveDialog({
                defaultUri,
                filters: { Markdown: ['md'] },
                title: 'Save Folder Structure as Markdown',
            });
            if (!uri) { return; }

            const tree = generateTree(root);
            const content = `# Folder Structure\n\n\`\`\`\n${tree}\`\`\`\n`;
            fs.writeFileSync(uri.fsPath, content, 'utf8');

            const open = await vscode.window.showInformationMessage(
                `Saved to ${uri.fsPath}`,
                'Open File'
            );
            if (open === 'Open File') {
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc);
            }
        })
    );

    // Expand all folders in the tree
    context.subscriptions.push(
        vscode.commands.registerCommand('folderStructure.expandAll', async () => {
            await expandAll(treeView, provider, provider.getChildren());
        })
    );

    // Re-render when settings change
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('folderStructure')) {
                provider.refresh();
            }
        })
    );

    // Re-render on file system changes
    const watcher = vscode.workspace.createFileSystemWatcher('**/*');
    context.subscriptions.push(watcher);
    watcher.onDidCreate(() => provider.refresh());
    watcher.onDidDelete(() => provider.refresh());
}

export function deactivate(): void { /* nothing to clean up */ }

async function expandAll(
    view: vscode.TreeView<FolderItem>,
    provider: FolderStructureProvider,
    items: FolderItem[]
): Promise<void> {
    for (const item of items) {
        if (item.isDirectory) {
            await view.reveal(item, { expand: true, select: false, focus: false });
            await expandAll(view, provider, provider.getChildren(item));
        }
    }
}

function getWorkspaceRoot(): string | undefined {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders || folders.length === 0) {
        vscode.window.showWarningMessage('Folder Structure: No workspace folder is open.');
        return undefined;
    }
    return folders[0].uri.fsPath;
}
