import * as fs from 'fs';
import * as path from 'path';
import { getConfig, FolderStructureConfig } from './configManager';
import { parseGitignore, shouldExclude } from './excludeUtils';

function buildTree(
    dirPath: string,
    config: FolderStructureConfig,
    gitignorePatterns: string[],
    prefix: string
): string {
    let entries: fs.Dirent[];
    try {
        entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
        return '';
    }

    const filtered = entries.filter(e => !shouldExclude(e.name, config, gitignorePatterns));

    // Folders first, then files — each group sorted alphabetically
    filtered.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) { return -1; }
        if (!a.isDirectory() && b.isDirectory()) { return 1; }
        return a.name.localeCompare(b.name);
    });

    let result = '';
    filtered.forEach((entry, index) => {
        const isLast = index === filtered.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const childPrefix = isLast ? prefix + '    ' : prefix + '│   ';

        result += prefix + connector + entry.name + '\n';

        if (entry.isDirectory()) {
            result += buildTree(
                path.join(dirPath, entry.name),
                config,
                gitignorePatterns,
                childPrefix
            );
        }
    });

    return result;
}

export function generateTree(rootPath: string): string {
    const config = getConfig();
    const gitignorePatterns = config.respectGitignore
        ? parseGitignore(rootPath)
        : [];

    const rootName = path.basename(rootPath);
    return rootName + '/\n' + buildTree(rootPath, config, gitignorePatterns, '');
}
