/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('fs');
jest.mock('../src/util/file-store');
jest.mock('../src/util/cache-store');

import * as fs from 'fs';
import * as fileStore from '../src/util/file-store';
import * as cacheStore from '../src/util/cache-store';

const mockFs = fs as any;
const mockFileStore = fileStore as any;
const mockCacheStore = cacheStore as any;

import * as sut from '../src/util/stats-service';

beforeEach(() => {
    mockFs.existsSync.mockReset();
    mockFs.readFileSync.mockReset();
    mockFs.writeFileSync.mockReset();

    mockFileStore.getCount.mockReset();

    mockCacheStore.getCount.mockReset();
});

describe('stats service', () => {
    describe('incrementCacheHit', () => {
        it('should default the stats when the stats file is missing', () => {
            let savePath = '';

            mockFs.existsSync.mockReturnValue(false);
            mockFs.writeFileSync.mockImplementation((path: any, data: any) => {
                savePath = path;
            });

            sut.incrementCacheHit();

            expect(mockFs.writeFileSync).toHaveBeenCalledWith(savePath, JSON.stringify({ cacheHits: 1, cacheMisses: 0 }));
        });
        it('should read from stats file and increase the number of cache hits', () => {
            let savePath = '';

            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify({ cacheHits: 1 }));
            mockFs.writeFileSync.mockImplementation((path: any, data: any) => {
                savePath = path;
            });

            sut.incrementCacheHit();

            expect(mockFs.writeFileSync).toHaveBeenCalledWith(savePath, JSON.stringify({ cacheHits: 2 }));
        });
    });

    describe('incrementCacheMiss', () => {
        it('should default the stats when the stats file is missing', () => {
            let savePath = '';

            mockFs.existsSync.mockReturnValue(false);
            mockFs.writeFileSync.mockImplementation((path: any, data: any) => {
                savePath = path;
            });

            sut.incrementCacheMiss();

            expect(mockFs.writeFileSync).toHaveBeenCalledWith(savePath, JSON.stringify({ cacheHits: 0, cacheMisses: 1 }));
        });
        it('should read from stats file and increase the number of cache misses', () => {
            let savePath = '';

            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify({ cacheMisses: 1 }));
            mockFs.writeFileSync.mockImplementation((path: any, data: any) => {
                savePath = path;
            });

            sut.incrementCacheMiss();

            expect(mockFs.writeFileSync).toHaveBeenCalledWith(savePath, JSON.stringify({ cacheMisses: 2 }));
        });
    });

    describe('getStats', () => {
        it('should return the aggregated stats', async () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readFileSync.mockReturnValue(JSON.stringify({ cacheHits: 8, cacheMisses: 3 }));
            mockFileStore.getCount.mockResolvedValue(5);
            mockCacheStore.getCount.mockResolvedValue(12);

            const result = await sut.getStats();

            expect(result).not.toBeNull();
            expect(result.cacheHits).toBe(8);
            expect(result.cacheMisses).toBe(3);
            expect(result.hitRatio).toBe(8 / (8 + 3));
            expect(result.totalFiles).toBe(5);
            expect(result.cachedFiles).toBe(12);
        });
    });
});