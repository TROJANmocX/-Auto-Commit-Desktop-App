export default function BottomBar({
    status,
    onRun,
    onStop,
    onUndo,
    canUndo,
    disabled
}) {
    const isRunning = status === 'running';

    return (
        <div className="h-16 bg-carbon-panel border-t border-carbon-border flex items-center justify-between px-6">
            <div className="text-xs text-carbon-text-secondary">
                {canUndo && !isRunning && (
                    <span>
                        Undo available after run •{' '}
                        <button
                            className="text-carbon-accent hover:underline"
                            onClick={onUndo}
                        >
                            Undo last run
                        </button>
                    </span>
                )}
            </div>

            <button
                className={`btn-primary text-lg px-8 py-3 glow-on-hover ${isRunning ? 'bg-carbon-danger hover:bg-carbon-danger/90' : ''
                    }`}
                onClick={isRunning ? onStop : onRun}
                disabled={disabled && !isRunning}
            >
                {isRunning ? 'STOP' : 'RUN'}
            </button>
        </div>
    );
}
