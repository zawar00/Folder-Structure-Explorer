import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getConfig, FolderStructureConfig } from './configManager';
import { parseGitignore, shouldExclude } from './excludeUtils';

export class FolderItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly resourceUri: vscode.Uri,
        collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly isDirectory: boolean
    ) {
        super(label, collapsibleState);
        this.resourceUri = resourceUri;
        this.contextValue = isDirectory ? 'folder' : 'file';
        this.iconPath = isDirectory ? vscode.ThemeIcon.Folder : vscode.ThemeIcon.File;

        if (!isDirectory) {
            this.command = {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [resourceUri],
            };
        }
    }
}

export class FolderStructureProvider implements vscode.TreeDataProvider<FolderItem> {
    private readonly _onDidChangeTreeData =
        new vscode.EventEmitter<FolderItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private gitignorePatterns: string[] = [];
    private gitignoreLoaded = false;

    // Cache keyed by absolute fsPath — ensures reveal() gets the same object reference
    private itemCache = new Map<string, FolderItem>();

    refresh(): void {
        this.gitignorePatterns = [];
        this.gitignoreLoaded = false;
        this.itemCache.clear();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: FolderItem): vscode.TreeItem {
        return element;
    }

    // Required by reveal() to walk up to the root
    getParent(element: FolderItem): FolderItem | undefined {
        const parentPath = path.dirname(element.resourceUri.fsPath);
        const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!rootPath || parentPath === rootPath || parentPath === element.resourceUri.fsPath) {
            return undefined;
        }
        return this.itemCache.get(parentPath);
    }

    getChildren(element?: FolderItem): FolderItem[] {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            return [];
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const config = getConfig();

        if (!this.gitignoreLoaded && config.respectGitignore) {
            this.gitignorePatterns = parseGitignore(rootPath);
            this.gitignoreLoaded = true;
        }

        if (element && !element.isDirectory) {
            return [];
        }

        const dirPath = element ? element.resourceUri.fsPath : rootPath;
        return this.getDirectoryItems(dirPath, config);
    }

    private getDirectoryItems(
        dirPath: string,
        config: FolderStructureConfig
    ): FolderItem[] {
        let entries: fs.Dirent[];
        try {
            entries = fs.readdirSync(dirPath, { withFileTypes: true });
        } catch {
            return [];
        }

        const filtered = entries.filter(
            e => !shouldExclude(e.name, config, this.gitignorePatterns)
        );

        filtered.sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) { return -1; }
            if (!a.isDirectory() && b.isDirectory()) { return 1; }
            return a.name.localeCompare(b.name);
        });

        return filtered.map(entry => {
            const isDir = entry.isDirectory();
            const fsPath = path.join(dirPath, entry.name);

            const cached = this.itemCache.get(fsPath);
            if (cached) { return cached; }

            const item = new FolderItem(
                entry.name,
                vscode.Uri.file(fsPath),
                isDir
                    ? vscode.TreeItemCollapsibleState.Collapsed
                    : vscode.TreeItemCollapsibleState.None,
                isDir
            );
            this.itemCache.set(fsPath, item);
            return item;
        });
    }
}
