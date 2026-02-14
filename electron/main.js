import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import simpleGit from 'simple-git';
import { Worker } from 'worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

const isDev = process.env.NODE_ENV === 'development';

// Single instance lock - prevent multiple app instances
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, focus our window
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 800,
        minHeight: 520,
        backgroundColor: '#0E0F12',
        icon: join(__dirname, '../assets/icon.png'),
        webPreferences: {
            preload: join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
        },
        autoHideMenuBar: true,
        titleBarStyle: 'default',
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(join(__dirname, '../dist/index.html'));
    }

    // DEBUG: Always open DevTools to diagnose blank screen
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers

// Select directory dialog
ipcMain.handle('select-directory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
    });

    if (result.canceled) {
        return null;
    }

    return result.filePaths[0];
});

// Validate repository
ipcMain.handle('validate-repo', async (event, repoPath) => {
    try {
        const git = simpleGit(repoPath);

        // Check if .git exists
        const isRepo = await git.checkIsRepo();
        if (!isRepo) {
            return { valid: false, error: 'Not a git repository' };
        }

        // Get current branch and status
        const status = await git.status();
        const branch = status.current;

        // Check for uncommitted changes
        const hasUncommittedChanges =
            status.files.length > 0 ||
            status.modified.length > 0 ||
            status.created.length > 0 ||
            status.deleted.length > 0;

        // Check for remote
        const remotes = await git.getRemotes(true);
        const hasRemote = remotes.length > 0;
        const remoteName = hasRemote ? remotes[0].name : null;

        return {
            valid: true,
            branch,
            hasRemote,
            remoteName,
            remoteUrl: hasRemote ? remotes[0].refs.fetch : null,
            hasUncommittedChanges,
            uncommittedCount: status.files.length,
        };
    } catch (error) {
        return { valid: false, error: error.message };
    }
});

// Get branches
ipcMain.handle('get-branches', async (event, repoPath) => {
    try {
        const git = simpleGit(repoPath);
        const branches = await git.branchLocal();
        return { success: true, branches: branches.all };
    } catch (error) {
        return { success: false, error: error.message };
    }
});


// ...

// Track active workers
let currentWorker = null;

ipcMain.handle('create-commits', async (event, { repoPath, commits, autoPush, branch }) => {
    return new Promise((resolve, reject) => {
        if (currentWorker) {
            currentWorker.terminate();
        }

        // Generate session ID for this run
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        currentWorker = new Worker(join(__dirname, 'worker.js'));

        currentWorker.on('message', (message) => {
            if (message.type === 'progress') {
                event.sender.send('commit-progress', message.data);
            } else if (message.type === 'result') {
                resolve(message.data);
                currentWorker.terminate();
                currentWorker = null;
            } else if (message.type === 'cancelled') {
                // specific handling if needed, but result usually follows
            }
        });

        currentWorker.on('error', (error) => {
            console.error('Worker error:', error);
            resolve({ success: false, error: error.message });
            currentWorker = null;
        });

        currentWorker.on('exit', (code) => {
            if (code !== 0 && currentWorker) {
                // If exit non-zero and not manually terminated
                resolve({ success: false, error: `Worker stopped with exit code ${code}` });
            }
        });

        // Start execution
        currentWorker.postMessage({
            type: 'create-commits',
            data: { repoPath, commits, autoPush, branch, sessionId }
        });
    });
});

ipcMain.handle('cancel-execution', async () => {
    if (currentWorker) {
        currentWorker.postMessage({ type: 'cancel-execution' });
        // We wait for the worker to cleanup and send result
        return { success: true };
    }
    return { success: false, error: 'No active execution' };
});

ipcMain.handle('analyze-repo', async (event, repoPath) => {
    return new Promise((resolve, reject) => {
        if (currentWorker) {
            // Determine if we can overlap or need to queue?
            // For simplicity, terminate current worker if it's idle? 
            // Or just spawn a new one temporary?
            // Or reuse?
            // Reuse existing worker logic implies strictly sequential.
            // If execution is running, we shouldn't analyze.
            // If worker is running execution, reject analysis.
            // But current logic terminates worker after result.
            // So if currentWorker exists, it's busy.
            reject(new Error('Background worker busy'));
            return;
        }

        const worker = new Worker(join(__dirname, 'worker.js'));

        worker.on('message', (message) => {
            if (message.type === 'analysis-result') {
                resolve(message.data);
                worker.terminate();
            }
        });

        worker.on('error', (error) => {
            resolve({ success: false, error: error.message });
            worker.terminate();
        });

        worker.postMessage({
            type: 'analyze-repo',
            data: { repoPath }
        });
    });
});

// Undo commits (reset to previous state)
ipcMain.handle('undo-commits', async (event, { repoPath, commitHash }) => {
    try {
        const git = simpleGit(repoPath);
        await git.reset(['--hard', commitHash]);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Get last commit hash (for undo reference)
ipcMain.handle('get-last-commit', async (event, repoPath) => {
    try {
        const git = simpleGit(repoPath);
        const log = await git.log({ maxCount: 1 });
        return { success: true, hash: log.latest.hash };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
