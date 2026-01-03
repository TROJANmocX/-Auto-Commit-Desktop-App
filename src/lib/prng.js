/**
 * Simple seeded pseudo-random number generator (Mulberry32)
 * Returns a number between 0 and 1
 */
export function createRNG(seed) {
    return function () {
        var t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/**
 * Generate a random integer seed
 */
export function generateSeed() {
    return Math.floor(Math.random() * 2147483647);
}
