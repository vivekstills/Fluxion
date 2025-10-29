import * as crypto from 'crypto';

export function encodeFloat32Array(arr: Float32Array): string {
    const buffer = Buffer.from(arr.buffer);
    return buffer.toString('base64');
}

export function decodeFloat32Array(base64: string): Float32Array {
    const buffer = Buffer.from(base64, 'base64');
    return new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Float32Array.BYTES_PER_ELEMENT);
}

export async function sha256Base64(input: string | Buffer): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('base64');
}
