import { useState } from 'react';
import { format, parseISO } from 'date-fns';

export default function HeatmapPreview({ heatmapData }) {
    const [tooltip, setTooltip] = useState(null);

    if (!heatmapData || heatmapData.length === 0) {
        return (
            <div className="card p-4">
                <h3 className="text-sm font-semibold text-carbon-text mb-3">
                    Heatmap Preview
                </h3>
                <div className="text-center py-8 text-carbon-text-secondary text-sm">
                    Configure schedule to see preview
                </div>
            </div>
        );
    }

    // Group by weeks for display
    const weeks = [];
    let currentWeek = [];

    heatmapData.forEach((day, index) => {
        currentWeek.push(day);

        // Start new week on Sunday (or every 7 days)
        if (currentWeek.length === 7 || index === heatmapData.length - 1) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }
    });

    const handleMouseEnter = (day, event) => {
        const rect = event.target.getBoundingClientRect();
        setTooltip({
            date: format(parseISO(day.date), 'MMM dd, yyyy'),
            count: day.count,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <div className="card p-4 relative">
            <h3 className="text-sm font-semibold text-carbon-text mb-3">
                Heatmap Preview
            </h3>

            <div className="flex flex-wrap gap-1">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day) => (
                            <div
                                key={day.date}
                                className={`heatmap-cell level-${day.level}`}
                                onMouseEnter={(e) => handleMouseEnter(day, e)}
                                onMouseLeave={handleMouseLeave}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {tooltip && (
                <div
                    className="tooltip"
                    style={{
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    {tooltip.date} • {tooltip.count} {tooltip.count === 1 ? 'commit' : 'commits'}
                </div>
            )}
        </div>
    );
}
