import * as vscode from 'vscode';

export const DEFAULT_DEPENDENCY_FOLDERS = [
    // JavaScript / Node
    'node_modules', 'bower_components', 'jspm_packages',
    // PHP / Go / Ruby
    'vendor', 'vendors',
    // Python
    'venv', '.venv', 'env', '__pycache__', '.tox', 'site-packages',
    // Java / Kotlin / Gradle / Maven
    '.gradle', '.mvn',
    // C# / .NET
    'packages', '.nuget',
    // Rust
    // (target is intentionally omitted — too common as a generic name)
    // General build / cache
    '.cache', '.parcel-cache', '.turbo', '.nx',
];

export interface FolderStructureConfig {
    excludeNodeModules: boolean;
    excludeGitFolder: boolean;
    respectGitignore: boolean;
    excludeHiddenFiles: boolean;
    customExcludePatterns: string[];
    excludeDependencyFolders: boolean;
    dependencyFoldersList: string[];
}

export function getConfig(): FolderStructureConfig {
    const config = vscode.workspace.getConfiguration('folderStructure');
    return {
        excludeNodeModules: config.get<boolean>('exclude.nodeModules', true),
        excludeGitFolder: config.get<boolean>('exclude.gitFolder', true),
        respectGitignore: config.get<boolean>('exclude.respectGitignore', true),
        excludeHiddenFiles: config.get<boolean>('exclude.hiddenFiles', false),
        customExcludePatterns: config.get<string[]>('exclude.customPatterns', []),
        excludeDependencyFolders: config.get<boolean>('exclude.dependencyFolders', true),
        dependencyFoldersList: config.get<string[]>('exclude.dependencyFoldersList', DEFAULT_DEPENDENCY_FOLDERS),
    };
}
