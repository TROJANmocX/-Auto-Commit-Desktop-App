export default function TopBar({ status }) {
    return (
        <div className="h-12 bg-carbon-panel border-b border-carbon-border flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
                <h1 className="text-lg font-semibold text-carbon-text">Auto Commit</h1>
            </div>

            <div className="flex items-center space-x-2">
                <div className={`status-dot ${status}`}></div>
                <span className="text-xs text-carbon-text-secondary capitalize">
                    {status}
                </span>
            </div>
        </div>
    );
}
