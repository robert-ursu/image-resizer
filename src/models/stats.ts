interface Stats {
    totalFiles: number;
    cachedFiles: number;
    cacheHits: number;
    cacheMisses: number;
    hitRatio: number;
}

export default Stats;