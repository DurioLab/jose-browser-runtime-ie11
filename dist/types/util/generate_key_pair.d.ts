import type { KeyLike } from '../types.js';
export interface GenerateKeyPairOptions {
    crv?: string;
    modulusLength?: number;
    extractable?: boolean;
}
declare function generateKeyPair(alg: string, options?: GenerateKeyPairOptions): Promise<{
    privateKey: KeyLike;
    publicKey: KeyLike;
}>;
export { generateKeyPair };
export default generateKeyPair;
