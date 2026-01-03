/**
 * Input validators and safety checks
 */

export const validators = {
    /**
     * Validate repository path
     */
    validateRepoPath(path) {
        if (!path || path.trim() === '') {
            return { valid: false, error: 'Repository path is required' };
        }
        return { valid: true };
    },

    /**
     * Validate date range
     */
    validateDateRange(startDate, endDate) {
        if (!startDate || !endDate) {
            return { valid: false, error: 'Start and end dates are required' };
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return { valid: false, error: 'Start date must be before end date' };
        }

        // Warn if date range is in the future
        const now = new Date();
        if (start > now) {
            return {
                valid: true,
                warning: 'Start date is in the future. This may look suspicious.'
            };
        }

        // Warn if date range is too long
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (daysDiff > 365) {
            return {
                valid: true,
                warning: 'Date range exceeds 1 year. Consider shorter periods.'
            };
        }

        return { valid: true };
    },

    /**
     * Validate commits per day
     */
    validateCommitsPerDay(count) {
        const num = parseInt(count, 10);

        if (isNaN(num) || num < 1) {
            return { valid: false, error: 'Commits per day must be at least 1' };
        }

        if (num > 10) {
            return { valid: false, error: 'Maximum 10 commits per day allowed' };
        }

        if (num > 5) {
            return {
                valid: true,
                warning: 'More than 5 commits/day looks automated',
                risky: true,
            };
        }

        return { valid: true };
    },

    /**
     * Validate commit message
     */
    validateCommitMessage(message) {
        if (!message || message.trim() === '') {
            return { valid: false, error: 'Commit message cannot be empty' };
        }

        if (message.length > 200) {
            return {
                valid: true,
                warning: 'Very long commit message. Consider keeping it concise.'
            };
        }

        return { valid: true };
    },

    /**
     * Validate custom message pool
     */
    validateMessagePool(messages) {
        if (!Array.isArray(messages)) {
            return { valid: false, error: 'Message pool must be an array' };
        }

        if (messages.length === 0) {
            return { valid: false, error: 'Message pool cannot be empty' };
        }

        const emptyMessages = messages.filter(m => !m || m.trim() === '');
        if (emptyMessages.length > 0) {
            return { valid: false, error: 'Message pool contains empty messages' };
        }

        if (messages.length < 5) {
            return {
                valid: true,
                warning: 'Consider adding more messages for variety (at least 5 recommended)'
            };
        }

        return { valid: true };
    },

    /**
     * Validate branch name
     */
    validateBranch(branch) {
        if (!branch || branch.trim() === '') {
            return { valid: false, error: 'Branch name is required' };
        }

        // Warn about main/master branch
        if (branch === 'main' || branch === 'master') {
            return {
                valid: true,
                warning: 'You are committing to the main branch. Ensure this is intentional.'
            };
        }

        return { valid: true };
    },

    /**
     * Overall configuration validation
     */
    validateConfig(config) {
        const errors = [];
        const warnings = [];

        // Validate all fields
        const repoCheck = this.validateRepoPath(config.repoPath);
        if (!repoCheck.valid) errors.push(repoCheck.error);

        const dateCheck = this.validateDateRange(config.startDate, config.endDate);
        if (!dateCheck.valid) errors.push(dateCheck.error);
        if (dateCheck.warning) warnings.push(dateCheck.warning);

        const commitsCheck = this.validateCommitsPerDay(config.commitsPerDay);
        if (!commitsCheck.valid) errors.push(commitsCheck.error);
        if (commitsCheck.warning) warnings.push(commitsCheck.warning);

        if (config.useRandomMessages && config.customMessages) {
            const messagesCheck = this.validateMessagePool(config.customMessages);
            if (!messagesCheck.valid) errors.push(messagesCheck.error);
            if (messagesCheck.warning) warnings.push(messagesCheck.warning);
        } else if (!config.useRandomMessages) {
            const messageCheck = this.validateCommitMessage(config.commitMessage);
            if (!messageCheck.valid) errors.push(messageCheck.error);
        }

        const branchCheck = this.validateBranch(config.branch);
        if (!branchCheck.valid) errors.push(branchCheck.error);
        if (branchCheck.warning) warnings.push(branchCheck.warning);

        return {
            valid: errors.length === 0,
            errors,
            warnings,
            risky: commitsCheck.risky || false,
        };
    },
};
