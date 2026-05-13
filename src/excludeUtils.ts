import * as fs from 'fs';
import * as path from 'path';
import { FolderStructureConfig } from './configManager';

export function parseGitignore(rootPath: string): string[] {
    const gitignorePath = path.join(rootPath, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
        return [];
    }
    const content = fs.readFileSync(gitignorePath, 'utf8');
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
}

function matchesPattern(name: string, pattern: string): boolean {
    // Strip trailing slash (directory-only markers) for name matching
    const clean = pattern.replace(/\/$/, '');
    if (clean.includes('*')) {
        const regexStr = clean
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '.+')
            .replace(/\*/g, '[^/]+');
        return new RegExp(`^${regexStr}$`).test(name);
    }
    return name === clean;
}

export function shouldExclude(
    name: string,
    config: FolderStructureConfig,
    gitignorePatterns: string[]
): boolean {
    if (config.excludeNodeModules && name === 'node_modules') {
        return true;
    }
    if (config.excludeGitFolder && name === '.git') {
        return true;
    }
    if (config.excludeHiddenFiles && name.startsWith('.')) {
        return true;
    }
    for (const pattern of config.customExcludePatterns) {
        if (matchesPattern(name, pattern)) {
            return true;
        }
    }
    if (config.respectGitignore) {
        for (const pattern of gitignorePatterns) {
            if (matchesPattern(name, pattern)) {
                return true;
            }
        }
    }
    return false;
}
