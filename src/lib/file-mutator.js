/**
 * File mutator for creating realistic diffs
 * Generates small, believable changes to files
 */

const FILE_TEMPLATES = {
    'activity.txt': (index) => `Activity log entry ${index}\nTimestamp: ${new Date().toISOString()}\n`,
    'notes.md': (index) => `# Notes\n\n## Entry ${index}\n\nSome thoughts and ideas...\n`,
    'todo.txt': (index) => `- Task ${index}\n- Review code\n- Update documentation\n`,
    'changelog.md': (index) => `## Changes\n\n- Update ${index}\n- Minor improvements\n`,
    'README.md': (index) => `# Project\n\nVersion: 1.0.${index}\n\nA simple project.\n`,
};

const COMMENT_STYLES = {
    js: '//',
    py: '#',
    md: '<!--',
    txt: '#',
};

export class FileMutator {
    constructor() {
        this.fileRotation = 0;
        this.files = Object.keys(FILE_TEMPLATES);
    }

    /**
     * Get next file to modify (rotating)
     */
    getNextFile() {
        const file = this.files[this.fileRotation % this.files.length];
        this.fileRotation++;
        return file;
    }

    /**
     * Generate content for a file
     */
    generateContent(filename, index) {
        const template = FILE_TEMPLATES[filename];
        if (template) {
            return template(index);
        }

        // Default content
        return `Update ${index}\n${new Date().toISOString()}\n`;
    }

    /**
     * Add a comment to existing content
     */
    addComment(content, fileExtension = 'txt') {
        const commentChar = COMMENT_STYLES[fileExtension] || '#';
        const comments = [
            'TODO: review this',
            'FIXME: optimize later',
            'NOTE: important change',
            'Update: minor adjustment',
            'Refactor: improve structure',
        ];

        const comment = comments[Math.floor(Math.random() * comments.length)];
        return `${commentChar} ${comment}\n${content}`;
    }

    /**
     * Add whitespace changes
     */
    addWhitespace(content) {
        const lines = content.split('\n');
        const randomLine = Math.floor(Math.random() * lines.length);
        lines.splice(randomLine, 0, ''); // Add blank line
        return lines.join('\n');
    }

    /**
     * Make a small text change
     */
    makeSmallChange(content) {
        const changes = [
            (c) => c + '\n// End of file\n',
            (c) => '// Updated\n' + c,
            (c) => c.replace(/\n/g, '\n\n').substring(0, c.length + 10),
        ];

        const change = changes[Math.floor(Math.random() * changes.length)];
        return change(content);
    }

    /**
     * Create a realistic mutation
     */
    mutate(filename, index, mutationType = 'random') {
        let content = this.generateContent(filename, index);

        if (mutationType === 'random') {
            const mutations = [
                () => this.addComment(content, filename.split('.').pop()),
                () => this.addWhitespace(content),
                () => this.makeSmallChange(content),
            ];

            const mutation = mutations[Math.floor(Math.random() * mutations.length)];
            content = mutation();
        }

        return content;
    }
}
