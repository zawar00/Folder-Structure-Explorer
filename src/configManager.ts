import * as vscode from 'vscode';

export interface FolderStructureConfig {
    excludeNodeModules: boolean;
    excludeGitFolder: boolean;
    respectGitignore: boolean;
    excludeHiddenFiles: boolean;
    customExcludePatterns: string[];
}

export function getConfig(): FolderStructureConfig {
    const config = vscode.workspace.getConfiguration('folderStructure');
    return {
        excludeNodeModules: config.get<boolean>('exclude.nodeModules', true),
        excludeGitFolder: config.get<boolean>('exclude.gitFolder', true),
        respectGitignore: config.get<boolean>('exclude.respectGitignore', true),
        excludeHiddenFiles: config.get<boolean>('exclude.hiddenFiles', false),
        customExcludePatterns: config.get<string[]>('exclude.customPatterns', []),
    };
}
