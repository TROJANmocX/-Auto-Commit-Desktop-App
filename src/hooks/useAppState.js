import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

import { generateSeed } from '../lib/prng';

/**
 * Central state management for the application
 */
export function useAppState() {
    // Configuration state
    const [config, setConfig] = useState({
        repoPath: '',
        commitMessage: 'minor update',
        useRandomMessages: false,
        customMessages: [],
        commitsPerDay: 2,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        skipWeekends: false,
        humanPattern: false,
        timeWindow: 'fullDay',
        excludedDates: [],
        dryRun: true,
        autoPush: false,
        branch: 'main',
        seed: generateSeed(),
        analysisData: null,
        useAnalysisPattern: false,
    });

    // Repository validation state
    const [repoValidation, setRepoValidation] = useState({
        valid: false,
        checking: false,
        branch: '',
        hasRemote: false,
        remoteName: '',
        remoteUrl: '',
        error: '',
    });

    // Execution state
    const [execution, setExecution] = useState({
        status: 'idle', // idle, running, success, error
        progress: {
            currentDay: 0,
            totalDays: 0,
            currentCommit: 0,
            totalCommits: 0,
            percentage: 0,
        },
        logs: [],
        lastRunCommitHash: null,
    });

    // Available branches
    const [branches, setBranches] = useState([]);

    // Update config
    const updateConfig = useCallback((updates) => {
        setConfig(prev => ({ ...prev, ...updates }));
    }, []);

    // Add log entry
    const addLog = useCallback((message, type = 'info') => {
        const timestamp = format(new Date(), 'HH:mm:ss');
        setExecution(prev => ({
            ...prev,
            logs: [...prev.logs, { timestamp, message, type }],
        }));
    }, []);

    // Clear logs
    const clearLogs = useCallback(() => {
        setExecution(prev => ({ ...prev, logs: [] }));
    }, []);

    // Update execution status
    const updateExecutionStatus = useCallback((status) => {
        setExecution(prev => ({ ...prev, status }));
    }, []);

    // Update progress
    const updateProgress = useCallback((progress) => {
        setExecution(prev => ({
            ...prev,
            progress: { ...prev.progress, ...progress },
        }));
    }, []);

    // Validate repository
    const validateRepo = useCallback(async (path) => {
        if (!path) {
            setRepoValidation({
                valid: false,
                checking: false,
                branch: '',
                hasRemote: false,
                remoteName: '',
                remoteUrl: '',
                error: 'No path provided',
            });
            return;
        }

        setRepoValidation(prev => ({ ...prev, checking: true }));

        try {
            const result = await window.electronAPI.validateRepo(path);

            if (result.valid) {
                setRepoValidation({
                    valid: true,
                    checking: false,
                    branch: result.branch,
                    hasRemote: result.hasRemote,
                    remoteName: result.remoteName,
                    remoteUrl: result.remoteUrl,
                    error: '',
                });

                // Update config with detected branch
                updateConfig({ branch: result.branch });

                // Fetch branches
                const branchesResult = await window.electronAPI.getBranches(path);
                if (branchesResult.success) {
                    setBranches(branchesResult.branches);
                }
            } else {
                setRepoValidation({
                    valid: false,
                    checking: false,
                    branch: '',
                    hasRemote: false,
                    remoteName: '',
                    remoteUrl: '',
                    error: result.error,
                });
            }
        } catch (error) {
            setRepoValidation({
                valid: false,
                checking: false,
                branch: '',
                hasRemote: false,
                remoteName: '',
                remoteUrl: '',
                error: error.message,
            });
        }
    }, [updateConfig]);

    // Analysis state
    const [analysis, setAnalysis] = useState({
        status: 'idle', // idle, analyzing, success, error
        data: null, // { hours: [], days: [] }
    });

    const runAnalysis = useCallback(async () => {
        if (!config.repoPath) return;

        setAnalysis(prev => ({ ...prev, status: 'analyzing' }));
        addLog('Analyzing repository history...', 'info');

        try {
            const result = await window.electronAPI.analyzeRepo(config.repoPath);

            if (result.success) {
                setAnalysis({
                    status: 'success',
                    data: result.distribution,
                });

                // Save to config and auto-enable
                updateConfig({
                    analysisData: result.distribution,
                    // If we want a separate toggle, we'd add it. 
                    // For now, let's say if analysisData is present, it's used IF timeWindow is 'custom'? 
                    // Or implicitly. Let's add useAnalysisPattern flag.
                    useAnalysisPattern: true,
                });

                addLog(`Analysis complete. Processed ${result.totalAnalyzed} commits.`, 'success');
            } else {
                setAnalysis(prev => ({ ...prev, status: 'error' }));
                addLog(`Analysis failed: ${result.error}`, 'error');
            }
        } catch (error) {
            setAnalysis(prev => ({ ...prev, status: 'error' }));
            addLog(`Analysis error: ${error.message}`, 'error');
        }
    }, [config.repoPath, addLog]);

    // Save last commit hash for undo
    const saveLastCommitHash = useCallback(async () => {
        if (!config.repoPath) return;

        try {
            const result = await window.electronAPI.getLastCommit(config.repoPath);
            if (result.success) {
                setExecution(prev => ({ ...prev, lastRunCommitHash: result.hash }));
            }
        } catch (error) {
            console.error('Failed to save last commit hash:', error);
        }
    }, [config.repoPath]);

    return {
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
    };
}
