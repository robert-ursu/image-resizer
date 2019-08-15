
import fs from 'fs';
import * as CacheStore from './cache-store';
import * as FileStore from './file-store';
import * as Resizer from './resizer';
import * as StatsService from './stats-service';

export async function get(fileName: string, width?: number, height?: number): Promise<fs.ReadStream> {
    const cacheKey = `${width}-${height}-${fileName}`;
    if (await CacheStore.exists(cacheKey)) {
        StatsService.incrementCacheHit();
        return CacheStore.get(cacheKey);
    } else if (await FileStore.exists(fileName)) {
        return new Promise<fs.ReadStream>((resolve): void => {
            const imageStream = FileStore.read(fileName);
            
            if (width != null && height != null) {
                StatsService.incrementCacheMiss();
                imageStream
                    .pipe(Resizer.resize(width, height))
                    .pipe(CacheStore.store(cacheKey))
                    .on('finish', (): void => {
                        resolve(CacheStore.get(cacheKey));
                    });
            } else {
                resolve(imageStream);
            }
        });
    } else {
        return null;
    }
};