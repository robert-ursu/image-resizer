/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
jest.mock('../src/util/cache-store');
jest.mock('../src/util/file-store');
jest.mock('../src/util/stats-service');
jest.mock('../src/util/resizer');

import * as cacheStore from '../src/util/cache-store';
import * as fileStore from '../src/util/file-store';
import * as statsService from '../src/util/stats-service';
import * as resizer from '../src/util/resizer';

const mockCacheStore = cacheStore as any;
const mockFileStore = fileStore as any;
const mockStatsService = statsService as any;
const mockResizer = resizer as any;

import * as sut from '../src/util/image-service';

beforeEach((): void => {
    mockCacheStore.exists.mockReset();
    mockCacheStore.get.mockReset();
    mockCacheStore.store.mockReset();
    mockCacheStore.getCount.mockReset();

    mockFileStore.exists.mockReset();
    mockFileStore.read.mockReset();
    mockFileStore.getCount.mockReset();

    mockStatsService.incrementCacheHit.mockReset();
    mockStatsService.incrementCacheMiss.mockReset();

    mockResizer.resize.mockReset();
});

describe('image-service', (): void => {
    it('should return null if image does not exist', async (): Promise<void> => {
        mockCacheStore.exists.mockResolvedValue(false);
        mockFileStore.exists.mockResolvedValue(false);

        const result = await sut.get('any-key');

        expect(result).toBe(null);
        expect(statsService.incrementCacheHit).not.toHaveBeenCalled();
        expect(statsService.incrementCacheMiss).not.toHaveBeenCalled();
    });

    it('should use cache image if key exists', async (): Promise<void> => {
        mockCacheStore.exists.mockResolvedValue(true);
        mockCacheStore.get.mockReturnValue({});

        const result = await sut.get('existing-key');

        expect(result).toBeDefined();
        expect(result).not.toBe(null);
        expect(mockStatsService.incrementCacheHit).toHaveBeenCalledTimes(1);
    });

    it('should use file store if cache key does not exist', async (): Promise<void> => {
        mockCacheStore.exists.mockResolvedValue(false);
        mockFileStore.exists.mockResolvedValue(true);
        mockFileStore.read.mockReturnValue({});

        const result = await sut.get('existing-key');

        expect(result).toBeDefined();
        expect(result).toStrictEqual({});
        expect(mockCacheStore.get).not.toBeCalled();
    });

    it('should use file store, resize and store to cache when cache key not exists and sizes are provied', async (): Promise<void> => {
        mockCacheStore.exists.mockResolvedValue(false);
        mockFileStore.exists.mockResolvedValue(true);
        mockFileStore.read.mockReturnValue({
            pipe: () => {
                return {
                    pipe: () => {
                        return {
                            on: (event: any, cb: any) => {
                                cb();
                            }
                        };
                    }
                };
            }
        });
        mockResizer.resize.mockReturnValue({});
        mockCacheStore.store.mockReturnValue({});
        mockCacheStore.get.mockReturnValue({});


        const result = await sut.get('existing-key', 500, 500);

        expect(result).toBeDefined();
        expect(result).toStrictEqual({});
        expect(mockStatsService.incrementCacheHit).not.toBeCalled();
        expect(mockStatsService.incrementCacheMiss).toBeCalled();
        expect(mockResizer.resize).toBeCalled();
        expect(mockCacheStore.store).toBeCalled();
        expect(mockCacheStore.get).toBeCalled();
    });
});