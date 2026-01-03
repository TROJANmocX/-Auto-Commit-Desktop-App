export default function ScheduleSection({
    commitsPerDay,
    startDate,
    endDate,
    skipWeekends,
    humanPattern,
    onCommitsPerDayChange,
    onStartDateChange,
    onEndDateChange,
    onSkipWeekendsChange,
    onHumanPatternChange,
    disabled
}) {
    return (
        <div className="section">
            <h3 className="section-title">Schedule</h3>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm text-carbon-text-secondary mb-1">
                        Commits per day
                    </label>
                    <input
                        type="number"
                        className="input-field"
                        min="1"
                        max="10"
                        value={commitsPerDay}
                        onChange={(e) => onCommitsPerDayChange(parseInt(e.target.value, 10))}
                        disabled={disabled}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm text-carbon-text-secondary mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            disabled={disabled}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-carbon-text-secondary mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            value={endDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            disabled={disabled}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="skipWeekends"
                            className="checkbox"
                            checked={skipWeekends}
                            onChange={(e) => onSkipWeekendsChange(e.target.checked)}
                            disabled={disabled}
                        />
                        <label
                            htmlFor="skipWeekends"
                            className="text-sm text-carbon-text cursor-pointer"
                        >
                            Skip weekends
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="humanPattern"
                            className="checkbox"
                            checked={humanPattern}
                            onChange={(e) => onHumanPatternChange(e.target.checked)}
                            disabled={disabled}
                        />
                        <label
                            htmlFor="humanPattern"
                            className="text-sm text-carbon-text cursor-pointer"
                            title="Adds irregular gaps and uneven days to mimic real usage"
                        >
                            Human pattern mode
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
