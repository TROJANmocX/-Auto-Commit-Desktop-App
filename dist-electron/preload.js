import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  // Directory selection
  selectDirectory: () => ipcRenderer.invoke("select-directory"),
  // Repository validation
  validateRepo: (repoPath) => ipcRenderer.invoke("validate-repo", repoPath),
  // Get branches
  getBranches: (repoPath) => ipcRenderer.invoke("get-branches", repoPath),
  // Create commits
  createCommits: (data) => ipcRenderer.invoke("create-commits", data),
  // Undo commits
  undoCommits: (data) => ipcRenderer.invoke("undo-commits", data),
  // Get last commit
  getLastCommit: (repoPath) => ipcRenderer.invoke("get-last-commit", repoPath),
  // Listen for commit progress
  onCommitProgress: (callback) => {
    ipcRenderer.on("commit-progress", (event, data) => callback(data));
  },
  // Remove progress listener
  removeCommitProgressListener: () => {
    ipcRenderer.removeAllListeners("commit-progress");
  }
});
