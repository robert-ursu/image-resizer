import sharp from 'sharp';
import { Duplex } from 'stream';

export function resize(width: number, height: number): Duplex {
    return sharp().resize(width, height, {
        fit: 'fill',
        withoutEnlargement: true
    });
};