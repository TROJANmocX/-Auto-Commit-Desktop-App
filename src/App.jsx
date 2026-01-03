import { useState, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { CommitGenerator } from './lib/commit-generator';
import { MessageGenerator } from './lib/message-generator';
import { FileMutator } from './lib/file-mutator';
import { validators } from './lib/validators';

import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import BottomBar from './components/BottomBar';
import RiskyConfigModal from './components/modals/RiskyConfigModal';
import UndoModal from './components/modals/UndoModal';
import DirtyRepoModal from './components/modals/DirtyRepoModal';

function App() {
    const {
        config,
        updateConfig,
        repoValidation,
        validateRepo,
        execution,
        updateExecutionStatus,
        updateProgress,
        addLog,
        clearLogs,
        branches,
        saveLastCommitHash,
        analysis,
        runAnalysis,
    } = useAppState();

    const [heatmapData, setHeatmapData] = useState([]);
    const [previewStats, setPreviewStats] = useState(null);
    const [showRiskyModal, setShowRiskyModal] = useState(false);
    const [showUndoModal, setShowUndoModal] = useState(false);
    const [showDirtyRepoModal, setShowDirtyRepoModal] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    // Validate repo when path changes
    useEffect(() => {
        if (config.repoPath) {
            validateRepo(config.repoPath);
        }
    }, [config.repoPath, validateRepo]);

    // Update preview when config changes
    useEffect(() => {
        if (config.startDate && config.endDate) {
            try {
                const generator = new CommitGenerator(config);
                const stats = generator.getPreviewStats();
                const heatmap = generator.getHeatmapData();

                setPreviewStats(stats);
                setHeatmapData(heatmap);
            } catch (error) {
                console.error('Preview generation error:', error);
                setPreviewStats(null);
                setHeatmapData([]);
            }
        }
    }, [config]);

    // Handle directory selection
    const handleBrowse = async () => {
        const path = await window.electronAPI.selectDirectory();
        if (path) {
            updateConfig({ repoPath: path });
        }
    };

    // Handle run button
    const handleRun = async () => {
        // Validate configuration
        const validation = validators.validateConfig(config);

        if (!validation.valid) {
            addLog(`Validation failed: ${validation.errors.join(', ')}`, 'error');
            return;
        }

        // Check for dirty repo (uncommitted changes) - only in non-dry-run mode
        if (repoValidation.hasUncommittedChanges && !config.dryRun) {
            setShowDirtyRepoModal(true);
            return;
        }

        // Show risky modal if needed
        if (validation.risky && !config.dryRun) {
            setShowRiskyModal(true);
            return;
        }

        await executeRun();
    };

    // Execute the commit run
    const executeRun = async () => {
        setShowDirtyRepoModal(false);
        setShowRiskyModal(false);
        clearLogs();
        updateExecutionStatus('running');

        try {
            // Save current commit hash for undo
            if (!config.dryRun) {
                await saveLastCommitHash();
            }

            addLog('Starting commit generation...', 'info');

            // Generate schedule
            const generator = new CommitGenerator(config);
            const schedule = generator.generateSchedule();

            addLog(`Generated schedule: ${schedule.length} commits`, 'success');

            // Generate messages
            const messageGen = new MessageGenerator(
                config.useRandomMessages ? config.customMessages : []
            );

            // Generate file mutations
            const fileMutator = new FileMutator();

            // Build commit list
            const commits = schedule.map((item, index) => {
                const message = config.useRandomMessages
                    ? messageGen.getRandomMessage()
                    : config.commitMessage;

                const file = fileMutator.getNextFile();
                const content = fileMutator.mutate(file, index);

                return {
                    message,
                    date: item.date.toISOString(),
                    file,
                    content,
                };
            });

            if (config.dryRun) {
                addLog('DRY RUN - No commits will be created', 'info');

                // Simulate progress
                for (let i = 0; i < commits.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 50));

                    const percentage = Math.round(((i + 1) / commits.length) * 100);
                    updateProgress({
                        currentCommit: i + 1,
                        totalCommits: commits.length,
                        percentage,
                    });

                    addLog(`[DRY RUN] Would create: ${commits[i].message}`, 'info');
                }

                addLog('Dry run complete', 'success');
                updateExecutionStatus('success');
            } else {
                addLog('Creating commits...', 'info');

                // Listen for progress updates
                window.electronAPI.onCommitProgress((data) => {
                    const percentage = Math.round((data.current / data.total) * 100);
                    updateProgress({
                        currentCommit: data.current,
                        totalCommits: data.total,
                        percentage,
                    });
                    addLog(`Created: ${data.commit}`, 'success');
                });

                // Create commits
                const result = await window.electronAPI.createCommits({
                    repoPath: config.repoPath,
                    commits,
                    autoPush: config.autoPush,
                    branch: config.branch,
                });

                window.electronAPI.removeCommitProgressListener();

                if (result.success) {
                    setSessionId(result.sessionId);
                    addLog(`Successfully created ${result.commits.length} commits`, 'success');
                    addLog(`Session ID: ${result.sessionId}`, 'info');

                    if (config.autoPush) {
                        if (result.pushError) {
                            addLog(`Push failed: ${result.pushError}`, 'warning');
                            addLog('Commits created locally but not pushed.', 'warning');
                        } else {
                            addLog(`Pushed to ${config.branch}`, 'success');
                        }
                    }

                    updateExecutionStatus('success');
                } else {
                    addLog(`Error: ${result.error}`, 'error');
                    updateExecutionStatus('error');
                }
            }
        } catch (error) {
            addLog(`Error: ${error.message}`, 'error');
            updateExecutionStatus('error');
        }
    };

    // Handle stop button
    const handleStop = async () => {
        await window.electronAPI.cancelExecution();
        addLog('Stopped by user', 'info');
        updateExecutionStatus('idle');
    };

    // Handle undo
    const handleUndo = async () => {
        setShowUndoModal(false);

        if (!execution.lastRunCommitHash) {
            addLog('No undo information available', 'error');
            return;
        }

        try {
            addLog('Undoing last run...', 'info');

            const result = await window.electronAPI.undoCommits({
                repoPath: config.repoPath,
                commitHash: execution.lastRunCommitHash,
            });

            if (result.success) {
                addLog('Successfully undone last run', 'success');
            } else {
                addLog(`Undo failed: ${result.error}`, 'error');
            }
        } catch (error) {
            addLog(`Undo error: ${error.message}`, 'error');
        }
    };

    const isRunning = execution.status === 'running';
    const canRun = repoValidation.valid && !isRunning;
    const canUndo = execution.lastRunCommitHash && !isRunning;

    return (
        <div className="w-full h-full flex flex-col">
            <TopBar status={execution.status} />

            <div className="flex-1 flex overflow-hidden">
                <LeftPanel
                    config={config}
                    updateConfig={updateConfig}
                    repoValidation={repoValidation}
                    branches={branches}
                    onBrowse={handleBrowse}
                    analysis={analysis}
                    onAnalyze={runAnalysis}
                    disabled={isRunning}
                />

                <RightPanel
                    execution={execution}
                    heatmapData={heatmapData}
                    previewStats={previewStats}
                />
            </div>

            <BottomBar
                status={execution.status}
                onRun={handleRun}
                onStop={handleStop}
                onUndo={() => setShowUndoModal(true)}
                canUndo={canUndo}
                disabled={!canRun}
            />

            {showRiskyModal && (
                <RiskyConfigModal
                    onCancel={() => setShowRiskyModal(false)}
                    onContinue={executeRun}
                />
            )}

            {showUndoModal && (
                <UndoModal
                    onCancel={() => setShowUndoModal(false)}
                    onConfirm={handleUndo}
                />
            )}

            {showDirtyRepoModal && (
                <DirtyRepoModal
                    uncommittedCount={repoValidation.uncommittedCount}
                    onCancel={() => setShowDirtyRepoModal(false)}
                    onContinue={executeRun}
                />
            )}
        </div>
    );
}

export default App;
