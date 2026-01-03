export default function ProgressSection({ execution, previewStats }) {
    const { status, progress } = execution;

    // Show preview stats when idle
    if (status === 'idle' && previewStats) {
        return (
            <div className="card p-4">
                <h3 className="text-sm font-semibold text-carbon-text mb-3">
                    Preview
                </h3>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-carbon-text-secondary">Total commits:</span>
                        <span className="text-carbon-text font-medium">{previewStats.totalCommits}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-carbon-text-secondary">Date range:</span>
                        <span className="text-carbon-text font-medium text-xs">
                            {previewStats.dateRange.start} → {previewStats.dateRange.end}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-carbon-text-secondary">Active days:</span>
                        <span className="text-carbon-text font-medium">{previewStats.activeDays}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-carbon-text-secondary">Days skipped:</span>
                        <span className="text-carbon-text font-medium">{previewStats.skippedDays}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-carbon-text-secondary">Avg per day:</span>
                        <span className="text-carbon-text font-medium">{previewStats.avgCommitsPerDay}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Show "Ready" when idle without preview
    if (status === 'idle') {
        return (
            <div className="card p-4">
                <div className="text-center py-8 text-carbon-text-secondary">
                    Ready.
                </div>
            </div>
        );
    }

    // Show progress when running
    if (status === 'running') {
        return (
            <div className="card p-4">
                <h3 className="text-sm font-semibold text-carbon-text mb-3">
                    Progress
                </h3>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-carbon-text-secondary">
                                Day {progress.currentDay} / {progress.totalDays}
                            </span>
                            <span className="text-carbon-text-secondary">
                                {progress.percentage}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-carbon-text-secondary">
                                Commit {progress.currentCommit} / {progress.totalCommits}
                            </span>
                        </div>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // Show success/error state
    return (
        <div className="card p-4">
            <div className={`text-center py-8 ${status === 'success' ? 'text-carbon-accent' : 'text-carbon-danger'
                }`}>
                {status === 'success' ? '✓ Complete' : '✗ Error'}
            </div>
        </div>
    );
}
