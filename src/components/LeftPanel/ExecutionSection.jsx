export default function ExecutionSection({
    dryRun,
    autoPush,
    branch,
    branches,
    onDryRunChange,
    onAutoPushChange,
    onBranchChange,
    disabled
}) {
    return (
        <div className="section">
            <h3 className="section-title">Execution</h3>

            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="dryRun"
                        className="checkbox"
                        checked={dryRun}
                        onChange={(e) => onDryRunChange(e.target.checked)}
                        disabled={disabled}
                    />
                    <label
                        htmlFor="dryRun"
                        className="text-sm text-carbon-text cursor-pointer"
                    >
                        Dry run (preview only)
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="autoPush"
                        className="checkbox"
                        checked={autoPush}
                        onChange={(e) => onAutoPushChange(e.target.checked)}
                        disabled={disabled || dryRun}
                    />
                    <label
                        htmlFor="autoPush"
                        className="text-sm text-carbon-text cursor-pointer"
                    >
                        Auto-push after run
                    </label>
                </div>

                <div>
                    <label className="block text-sm text-carbon-text-secondary mb-1">
                        Branch
                    </label>
                    {branches.length > 0 ? (
                        <select
                            className="input-field"
                            value={branch}
                            onChange={(e) => onBranchChange(e.target.value)}
                            disabled={disabled}
                        >
                            {branches.map((b) => (
                                <option key={b} value={b}>
                                    {b}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            className="input-field"
                            placeholder="main"
                            value={branch}
                            onChange={(e) => onBranchChange(e.target.value)}
                            disabled={disabled}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
