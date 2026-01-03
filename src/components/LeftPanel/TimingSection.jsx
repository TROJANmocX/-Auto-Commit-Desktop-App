export default function TimingSection({
    timeWindow,
    onTimeWindowChange,
    config,
    updateConfig,
    disabled
}) {
    const windows = [
        { value: 'morning', label: 'Morning', hint: '8 AM - 12 PM' },
        { value: 'afternoon', label: 'Afternoon', hint: '12 PM - 5 PM' },
        { value: 'evening', label: 'Evening', hint: '5 PM - 11 PM' },
        { value: 'fullDay', label: 'Full day', hint: '8 AM - 11 PM' },
    ];

    return (
        <div className="section">
            <h3 className="section-title">Timing</h3>

            <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-carbon-text-secondary">Human Pattern</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.humanPattern}
                            onChange={(e) => updateConfig({ humanPattern: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-carbon-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-carbon-accent"></div>
                    </label>
                </div>

                {config.humanPattern && (
                    <div className="mb-4">
                        <button
                            onClick={() => updateConfig({ seed: generateSeed() })}
                            className="w-full py-2 px-3 bg-carbon-bg-tertiary hover:bg-carbon-bg-secondary text-carbon-text-primary text-xs rounded border border-carbon-border-subtle flex items-center justify-center transition-colors"
                        >
                            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reshuffle Pattern
                        </button>
                        <p className="text-[10px] text-carbon-text-tertiary mt-1 text-center">
                            Current Seed: {config.seed}
                        </p>
                    </div>
                )}
                <label className="block text-sm text-carbon-text-secondary mb-2">
                    Commit time window
                </label>

                {windows.map((window) => (
                    <div key={window.value} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id={window.value}
                            name="timeWindow"
                            className="radio"
                            value={window.value}
                            checked={timeWindow === window.value}
                            onChange={(e) => onTimeWindowChange(e.target.value)}
                            disabled={disabled}
                        />
                        <label
                            htmlFor={window.value}
                            className="text-sm text-carbon-text cursor-pointer flex-1"
                        >
                            {window.label}
                            <span className="text-xs text-carbon-text-secondary ml-2">
                                {window.hint}
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
