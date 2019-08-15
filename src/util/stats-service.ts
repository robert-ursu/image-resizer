/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { appRoot } from '../config';
import * as FileStore from './file-store';
import * as CacheStore from './cache-store';
import Stats from '../models/stats';

function readStats(): any {
    if (fs.existsSync(path.join(appRoot, 'stats.json')))
        return JSON.parse(fs.readFileSync(path.join(appRoot, 'stats.json'), 'utf8'));
    return { cacheHits: 0, cacheMisses: 0 };
}

function writeStats(stats: any): void {
    fs.writeFileSync(path.join(appRoot, 'stats.json'), JSON.stringify(stats));
}

export function incrementCacheHit(): void {
    const stats = readStats();
    stats.cacheHits++;
    writeStats(stats);
}

export function incrementCacheMiss(): void {
    const stats = readStats();
    stats.cacheMisses++;
    writeStats(stats);
}

export async function getStats(): Promise<Stats> {
    const stats = await readStats();
    const filesCount = await FileStore.getCount();
    const cacheCount = await CacheStore.getCount();

    return {
        cacheHits: stats.cacheHits,
        cacheMisses: stats.cacheMisses,
        hitRatio: stats.cacheHits / (stats.cacheHits + stats.cacheMisses),
        totalFiles: filesCount,
        cachedFiles: cacheCount
    };
}