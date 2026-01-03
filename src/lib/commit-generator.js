import {
    addDays,
    isWeekend,
    setHours,
    setMinutes,
    setSeconds,
    format,
    parseISO,
    eachDayOfInterval,
} from 'date-fns';

/**
 * Commit schedule generator with human-like patterns
 */

const TIME_WINDOWS = {
    morning: { start: 8, end: 12 },
    afternoon: { start: 12, end: 17 },
    evening: { start: 17, end: 23 },
    fullDay: { start: 8, end: 23 },
};

import { createRNG } from './prng';

// ... (imports remain the same) ...

export class CommitGenerator {
    constructor(config) {
        this.config = {
            startDate: parseISO(config.startDate),
            endDate: parseISO(config.endDate),
            commitsPerDay: config.commitsPerDay || 2,
            skipWeekends: config.skipWeekends || false,
            humanPattern: config.humanPattern || false,
            timeWindow: config.timeWindow || 'fullDay',
            excludedDates: config.excludedDates || [],
            seed: config.seed || 12345,
        };

        // Initialize seeded RNG
        this.random = createRNG(this.config.seed);
    }

    /**
     * Generate complete commit schedule
     */
    generateSchedule() {
        const days = eachDayOfInterval({
            start: this.config.startDate,
            end: this.config.endDate,
        });

        const schedule = [];

        for (const day of days) {
            // Skip weekends if configured
            if (this.config.skipWeekends && isWeekend(day)) {
                continue;
            }

            // Skip excluded dates
            const dayStr = format(day, 'yyyy-MM-dd');
            if (this.config.excludedDates.includes(dayStr)) {
                continue;
            }

            // Human pattern: random zero-commit days
            if (this.config.humanPattern && this.random() < 0.15) {
                continue; // 15% chance of no commits
            }

            // Determine commits for this day
            let commitsToday = this.config.commitsPerDay;

            // Human pattern: uneven daily counts
            if (this.config.humanPattern) {
                const variance = Math.floor(this.random() * 3) - 1; // -1, 0, or 1
                commitsToday = Math.max(1, commitsToday + variance);

                // Occasional bursts
                if (this.random() < 0.1) {
                    commitsToday += Math.floor(this.random() * 3) + 1;
                }
            }

            // Generate commits for this day
            for (let i = 0; i < commitsToday; i++) {
                const commitTime = this.generateRandomTime(day);
                schedule.push({
                    date: commitTime,
                    dayStr,
                });
            }
        }

        return schedule;
    }

    /**
     * Generate random time within configured window
     */
    generateRandomTime(day) {
        // Use analysis pattern if enabled and data exists
        if (this.config.useAnalysisPattern && this.config.analysisData) {
            return this.generateTimeFromDistribution(day);
        }

        const window = TIME_WINDOWS[this.config.timeWindow];

        // Random hour within window
        const hour = Math.floor(this.random() * (window.end - window.start)) + window.start;

        // Random minute and second
        // ...
        const minute = Math.floor(this.random() * 60);
        const second = Math.floor(this.random() * 60);

        let time = setHours(day, hour);
        time = setMinutes(time, minute);
        time = setSeconds(time, second);

        return time;
    }

    generateTimeFromDistribution(day) {
        const { hours } = this.config.analysisData;

        // Weighted random choice for hour
        const totalWeight = hours.reduce((sum, count) => sum + count, 0);
        let randomWeight = this.random() * totalWeight;

        let selectedHour = 12; // default
        for (let i = 0; i < 24; i++) {
            randomWeight -= hours[i];
            if (randomWeight <= 0) {
                selectedHour = i;
                break;
            }
        }

        const minute = Math.floor(this.random() * 60);
        const second = Math.floor(this.random() * 60);

        let time = setHours(day, selectedHour);
        time = setMinutes(time, minute);
        time = setSeconds(time, second);

        return time;
    }

    /**
     * Get preview statistics
     */
    getPreviewStats() {
        const schedule = this.generateSchedule();

        const dayMap = new Map();
        schedule.forEach(commit => {
            const count = dayMap.get(commit.dayStr) || 0;
            dayMap.set(commit.dayStr, count + 1);
        });

        const totalDays = eachDayOfInterval({
            start: this.config.startDate,
            end: this.config.endDate,
        }).length;

        const activeDays = dayMap.size;
        const skippedDays = totalDays - activeDays;

        return {
            totalCommits: schedule.length,
            totalDays,
            activeDays,
            skippedDays,
            avgCommitsPerDay: (schedule.length / activeDays).toFixed(1),
            dateRange: {
                start: format(this.config.startDate, 'MMM dd, yyyy'),
                end: format(this.config.endDate, 'MMM dd, yyyy'),
            },
        };
    }

    /**
     * Generate heatmap data for preview
     */
    getHeatmapData() {
        const schedule = this.generateSchedule();

        const dayMap = new Map();
        schedule.forEach(commit => {
            const count = dayMap.get(commit.dayStr) || 0;
            dayMap.set(commit.dayStr, count + 1);
        });

        // Convert to array format for heatmap component
        const heatmapData = [];
        const days = eachDayOfInterval({
            start: this.config.startDate,
            end: this.config.endDate,
        });

        days.forEach(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const count = dayMap.get(dayStr) || 0;

            heatmapData.push({
                date: dayStr,
                count,
                level: this.getHeatmapLevel(count),
            });
        });

        return heatmapData;
    }

    /**
     * Get heatmap intensity level (0-4)
     */
    getHeatmapLevel(count) {
        if (count === 0) return 0;
        if (count === 1) return 1;
        if (count <= 3) return 2;
        if (count <= 5) return 3;
        return 4;
    }
}
