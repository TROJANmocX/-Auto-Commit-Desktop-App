import { parentPort } from 'worker_threads';
import simpleGit from 'simple-git';
import { join } from 'path';
import fs from 'fs/promises';

const activeSessions = new Set();

async function createCommits({ repoPath, commits, autoPush, branch, sessionId }) {
    try {
        const git = simpleGit(repoPath);
        const createdCommits = [];
        activeSessions.add(sessionId);

        for (const commit of commits) {
            // Check for cancellation
            if (!activeSessions.has(sessionId)) {
                break;
            }

            // Create or modify a file
            const filePath = join(repoPath, commit.file);
            await fs.writeFile(filePath, commit.content, 'utf-8');

            // Stage the file
            await git.add(commit.file);

            // Create commit
            const fullMessage = `${commit.message}\n\n[session:${sessionId}]`;

            const commitResult = await git.commit(fullMessage, {
                '--date': commit.date,
            });

            createdCommits.push({
                hash: commitResult.commit,
                message: commit.message,
                date: commit.date,
                sessionId,
            });

            // Send progress
            parentPort.postMessage({
                type: 'progress',
                data: {
                    current: createdCommits.length,
                    total: commits.length,
                    commit: commit.message,
                }
            });
        }

        const wasCancelled = !activeSessions.has(sessionId);
        activeSessions.delete(sessionId);

        if (wasCancelled) {
            return { success: false, error: 'Execution cancelled by user', commits: createdCommits, sessionId };
        }

        let pushError = null;
        if (autoPush) {
            try {
                await git.pull('origin', branch, { '--rebase': 'true' });
                await git.push('origin', branch);
            } catch (error) {
                console.error('Push failed:', error);
                pushError = error.message;
            }
        }

        return { success: true, commits: createdCommits, sessionId, pushError };

    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function analyzeRepo({ repoPath }) {
    try {
        const git = simpleGit(repoPath);
        // Get all commit dates, limit to recent 5000 for speed
        const log = await git.log(['--format=%aI', '--no-merges', '-n', '5000']);

        const distribution = {
            hours: new Array(24).fill(0),
            days: new Array(7).fill(0),
        };

        log.all.forEach(commit => {
            const date = new Date(commit.date);
            if (!isNaN(date)) {
                distribution.hours[date.getHours()]++;
                distribution.days[date.getDay()]++;
            }
        });

        return { success: true, distribution, totalAnalyzed: log.total };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

parentPort.on('message', async (message) => {
    if (message.type === 'create-commits') {
        const result = await createCommits(message.data);
        parentPort.postMessage({ type: 'result', data: result });
    } else if (message.type === 'analyze-repo') {
        const result = await analyzeRepo(message.data);
        parentPort.postMessage({ type: 'analysis-result', data: result });
    } else if (message.type === 'cancel-execution') {
        activeSessions.clear();
    }
});
