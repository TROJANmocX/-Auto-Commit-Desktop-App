import HeatmapPreview from './HeatmapPreview';
import ProgressSection from './ProgressSection';
import LiveLog from './LiveLog';

export default function RightPanel({ execution, heatmapData, previewStats }) {
    return (
        <div className="w-1/2 h-full bg-carbon-bg p-6 flex flex-col space-y-4 overflow-hidden">
            <HeatmapPreview heatmapData={heatmapData} />

            <ProgressSection
                execution={execution}
                previewStats={previewStats}
            />

            <LiveLog logs={execution.logs} />
        </div>
    );
}
