/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
jest.mock('fs');

import * as sut from '../src/util/cache-store';

import * as fs from 'fs';

const mockFs = fs as any;

beforeEach(() => {
    mockFs.access.mockReset();
    mockFs.createReadStream.mockReset();
    mockFs.createWriteStream.mockReset();
    mockFs.readdir.mockReset();
});

describe('cache store', () => {
    describe('exists', () => {
        it('should reolve to false when file not exists', async () => {
            mockFs.access.mockImplementation((path: any, cb: any) => {
                cb(new Error());
            });

            const result = await sut.exists('any-key');

            expect(result).toBe(false);
        });

        it('should reolve to true when file exists', async () => {
            mockFs.access.mockImplementation((path: any, cb: any) => {
                cb(null);
            });

            const result = await sut.exists('any-key');

            expect(result).toBe(true);
        });
    });

    describe('get', () => {
        it('should return read stream', () => {
            mockFs.createReadStream.mockReturnValue([]);

            const result = sut.get('any-key');

            expect(result).toStrictEqual([]);
        });
    });

    describe('store', () => {
        it('should return write stream', () => {
            mockFs.createWriteStream.mockReturnValue([]);

            const result = sut.store('any-key');

            expect(result).toStrictEqual([]);
        });
    });

    describe('getCount', () => {
        it('should resolve to directory files count when path is correct', async () => {
            mockFs.readdir.mockImplementation((path: any, cb: any) => {
                cb(null, [1, 2, 3]);
            });

            const result = await sut.getCount();

            expect(result).toBe(3);
        });

        it('should reject when path is incorrect', async () => {
            mockFs.readdir.mockImplementation((path: any, cb: any) => {
                cb('error', null);
            });

            const result = sut.getCount();

            await expect(result).rejects.toBe('error');
        });
    });
});