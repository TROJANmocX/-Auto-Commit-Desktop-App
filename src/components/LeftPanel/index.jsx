import RepoSection from './RepoSection';
import CommitSection from './CommitSection';
import ScheduleSection from './ScheduleSection';
import TimingSection from './TimingSection';
import ExecutionSection from './ExecutionSection';

export default function LeftPanel({
    config,
    updateConfig,
    repoValidation,
    branches,
    onBrowse,
    analysis,
    onAnalyze,
    disabled
}) {
    return (
        <div className="w-1/2 h-full bg-carbon-panel border-r border-carbon-border p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
                <RepoSection
                    repoPath={config.repoPath}
                    onRepoPathChange={(path) => updateConfig({ repoPath: path })}
                    validation={repoValidation}
                    analysis={analysis}
                    onAnalyze={onAnalyze}
                    onBrowse={onBrowse}
                    disabled={disabled}
                />

                <CommitSection
                    commitMessage={config.commitMessage}
                    useRandomMessages={config.useRandomMessages}
                    customMessages={config.customMessages}
                    onCommitMessageChange={(msg) => updateConfig({ commitMessage: msg })}
                    onUseRandomMessagesChange={(use) => updateConfig({ useRandomMessages: use })}
                    onCustomMessagesChange={(msgs) => updateConfig({ customMessages: msgs })}
                    disabled={disabled}
                />

                <ScheduleSection
                    commitsPerDay={config.commitsPerDay}
                    startDate={config.startDate}
                    endDate={config.endDate}
                    skipWeekends={config.skipWeekends}
                    humanPattern={config.humanPattern}
                    onCommitsPerDayChange={(count) => updateConfig({ commitsPerDay: count })}
                    onStartDateChange={(date) => updateConfig({ startDate: date })}
                    onEndDateChange={(date) => updateConfig({ endDate: date })}
                    onSkipWeekendsChange={(skip) => updateConfig({ skipWeekends: skip })}
                    onHumanPatternChange={(human) => updateConfig({ humanPattern: human })}
                    disabled={disabled}
                />

                <TimingSection
                    timeWindow={config.timeWindow}
                    onTimeWindowChange={(window) => updateConfig({ timeWindow: window })}
                    config={config}
                    updateConfig={updateConfig}
                    disabled={disabled}
                />

                <ExecutionSection
                    dryRun={config.dryRun}
                    autoPush={config.autoPush}
                    branch={config.branch}
                    branches={branches}
                    onDryRunChange={(dry) => updateConfig({ dryRun: dry })}
                    onAutoPushChange={(push) => updateConfig({ autoPush: push })}
                    onBranchChange={(branch) => updateConfig({ branch: branch })}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
