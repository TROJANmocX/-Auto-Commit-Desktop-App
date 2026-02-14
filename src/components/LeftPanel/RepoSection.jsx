export default function RepoSection({
    repoPath,
    onRepoPathChange,
    validation,
    onBrowse,
    disabled,
    onAnalyze,
    analysis
}) {
    return (
        <div className="section">
            <h3 className="section-title">Repository</h3>

            <div className="space-y-2">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        className="input-field flex-1"
                        placeholder="/path/to/your/repo"
                        value={repoPath}
                        onChange={(e) => onRepoPathChange(e.target.value)}
                        disabled={disabled}
                    />
                    <button
                        className="btn-secondary"
                        onClick={onBrowse}
                        disabled={disabled}
                    >
                        Browse
                    </button>
                </div>

                {validation.checking && (
                    <div className="text-xs text-carbon-text-secondary">
                        Validating repository...
                    </div>
                )}

                {validation.valid && !validation.checking && (
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="checkmark">✔</span>
                            <span className="text-carbon-text-secondary">Git repo detected</span>
                        </div>
                        {validation.hasRemote && (
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="checkmark">✔</span>
                                <span className="text-carbon-text-secondary">
                                    Remote: {validation.remoteName}/{validation.branch}
                                </span>
                            </div>
                        )}

                        {/* Analysis Button */}
                        <div className="pt-2">
                            <button
                                onClick={onAnalyze}
                                disabled={disabled || analysis.status === 'analyzing'}
                                className={`w-full py-1 px-2 text-xs rounded border flex items-center justify-center transition-colors ${analysis.status === 'success'
                                        ? 'bg-green-900 border-green-700 text-green-100'
                                        : 'bg-carbon-bg-tertiary border-carbon-border-subtle text-carbon-text hover:bg-carbon-bg-secondary'
                                    }`}
                            >
                                {analysis.status === 'analyzing' && (
                                    <span className="mr-2 animate-spin">⟳</span>
                                )}
                                {analysis.status === 'success' ? 'Stats Analyzed' : 'Analyze Commit Habits'}
                            </button>
                        </div>

                        {!validation.hasRemote && (
                            <div className="flex items-center space-x-2 text-sm text-yellow-500">
                                <span>⚠</span>
                                <span>No remote configured</span>
                            </div>
                        )}
                    </div>
                )}

                {validation.error && !validation.checking && (
                    <div className="text-xs text-carbon-danger">
                        {validation.error}
                    </div>
                )}
            </div>
        </div>
    );
}
