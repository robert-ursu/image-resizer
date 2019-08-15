import path from 'path';

export const apiPort = Number(process.env.API_PORT || 3000);
export const appRoot = path.normalize(__dirname);