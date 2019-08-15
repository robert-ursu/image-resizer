import fs from 'fs';
import path from 'path';
import { appRoot } from '../config';

const basePath = path.join(appRoot, 'images');

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
}

export async function exists(key: string): Promise<boolean> {
    return new Promise((resolve): void => {
        fs.access(path.join(basePath, key), (error): void => resolve(!error));
    });
}

export function read(key: string): fs.ReadStream {
    return fs.createReadStream(path.join(basePath, key));
}

export async function getCount(): Promise<number> {
    return new Promise((resolve, reject): void => {
        fs.readdir(path.normalize(basePath), (error, files): void => {
            if (error) {
                reject(error);
            }
            resolve(files.length);
        });
    });
}