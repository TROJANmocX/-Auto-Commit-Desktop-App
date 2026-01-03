/**
 * Commit message generator
 * Provides random messages and template support
 */

const DEFAULT_MESSAGES = [
    'minor update',
    'fix typo',
    'update documentation',
    'refactor code',
    'improve performance',
    'update dependencies',
    'clean up code',
    'add comments',
    'fix formatting',
    'update README',
    'minor improvements',
    'code cleanup',
    'update config',
    'fix bug',
    'enhance functionality',
    'optimize code',
    'update styles',
    'improve logic',
    'add validation',
    'update tests',
];

export class MessageGenerator {
    constructor(customMessages = []) {
        this.messages = customMessages.length > 0 ? customMessages : DEFAULT_MESSAGES;
        this.usedIndices = new Set();
    }

    /**
     * Get a random commit message
     * Ensures variety by tracking used messages
     */
    getRandomMessage() {
        // Reset if all messages have been used
        if (this.usedIndices.size >= this.messages.length) {
            this.usedIndices.clear();
        }

        let index;
        do {
            index = Math.floor(Math.random() * this.messages.length);
        } while (this.usedIndices.has(index));

        this.usedIndices.add(index);
        return this.messages[index];
    }

    /**
     * Generate message from template
     * Supports placeholders: {date}, {time}, {random}
     */
    fromTemplate(template, date) {
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().split(' ')[0];
        const randomNum = Math.floor(Math.random() * 1000);

        return template
            .replace('{date}', dateStr)
            .replace('{time}', timeStr)
            .replace('{random}', randomNum);
    }

    /**
     * Get multiple unique messages
     */
    getMessages(count) {
        const messages = [];
        for (let i = 0; i < count; i++) {
            messages.push(this.getRandomMessage());
        }
        return messages;
    }
}
