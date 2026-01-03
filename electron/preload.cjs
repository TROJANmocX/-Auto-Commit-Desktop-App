const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Directory selection
    selectDirectory: () => ipcRenderer.invoke('select-directory'),

    // Repository validation
    validateRepo: (repoPath) => ipcRenderer.invoke('validate-repo', repoPath),

    // Get branches
    getBranches: (repoPath) => ipcRenderer.invoke('get-branches', repoPath),

    // Analyze repo
    analyzeRepo: (repoPath) => ipcRenderer.invoke('analyze-repo', repoPath),

    // Create commits
    createCommits: (data) => ipcRenderer.invoke('create-commits', data),

    // Undo commits
    undoCommits: (data) => ipcRenderer.invoke('undo-commits', data),

    // Get last commit
    getLastCommit: (repoPath) => ipcRenderer.invoke('get-last-commit', repoPath),

    // Cancel execution
    cancelExecution: () => ipcRenderer.invoke('cancel-execution'),

    // Listen for commit progress
    onCommitProgress: (callback) => {
        ipcRenderer.on('commit-progress', (event, data) => callback(data));
    },

    // Remove progress listener
    removeCommitProgressListener: () => {
        ipcRenderer.removeAllListeners('commit-progress');
    },
});
